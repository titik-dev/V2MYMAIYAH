<?php
add_action('graphql_register_types', function () {
    register_graphql_field('RootQuery', 'wppPopularPosts', [
        'type' => ['list_of' => 'Post'], // Returns a list of standard Post types
        'description' => 'Returns popular posts based on WordPress Popular Posts plugin data',
        'args' => [
            'first' => [
                'type' => 'Int',
                'description' => 'Number of posts to return',
                'defaultValue' => 10,
            ],
            'range' => [
                'type' => 'String',
                'description' => 'Time range: last24hours, last7days, last30days, all',
                'defaultValue' => 'last30days',
            ],
        ],
        'resolve' => function ($source, $args, $context, $info) {

            // Check if WPP plugin is active
            if (!class_exists('\WordPressPopularPosts\Query')) {
                return [];
            }

            // Setup WPP Query arguments
            $query_args = [
                'post_type' => 'post',
                'limit' => $args['first'],
                'range' => $args['range'],
                'order_by' => 'views',
            ];

            // Execute WPP Query
            $wpp_query = new \WordPressPopularPosts\Query($query_args);
            $wpp_results = $wpp_query->get_posts(); // Returns array of stdClass objects with 'id' property or WP_Post depending on config
    
            if (empty($wpp_results)) {
                return [];
            }

            // Collect IDs and ensure unique
            $post_ids = [];
            foreach ($wpp_results as $p) {
                // WPP might return object or array depending on version, handle both safely
                if (is_object($p) && isset($p->id)) {
                    $post_ids[] = $p->id;
                } elseif (is_array($p) && isset($p['id'])) {
                    $post_ids[] = $p['id'];
                } elseif (is_numeric($p)) { // Sometimes just ID
                    $post_ids[] = $p;
                }
            }

            if (empty($post_ids)) {
                return [];
            }

            // Fetch actual WP_Post objects using standard WP query to ensure GraphQL compatibility
            // 'orderby' => 'post__in' preserves the ranking order from WPP
            $final_posts = get_posts([
                'post__in' => $post_ids,
                'orderby' => 'post__in',
                'posts_per_page' => count($post_ids),
                'post_type' => 'post',
                'post_status' => 'publish'
            ]);

            return $final_posts;
        }
    ]);
});
