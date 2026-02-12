<?php
// Function to register ACF Options Page
if( function_exists('acf_add_options_page') ) {
    
    acf_add_options_page(array(
        'page_title'    => 'Maiyah Global Settings',
        'menu_title'    => 'Maiyah Settings',
        'menu_slug'     => 'maiyah-global-settings',
        'capability'    => 'edit_posts',
        'redirect'      => false,
        'icon_url'      => 'dashicons-admin-settings', // Ikon Gear
        'position'      => 6, // Di bawah Posts
        'show_in_graphql' => true, // Penting untuk headless
    ));
    
}
?>
