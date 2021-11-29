<?php

defined( 'ABSPATH' ) || die;

add_action( 'init', 'sober_child_init', 60 );
add_action( 'wp_enqueue_scripts', 'enqueue_styles' );
add_action( 'woocommerce_before_shop_loop', 'woocommerce_pagination', 40 );

function sober_child_init() {
    $ins = Sober_WooCommerce::instance();
    remove_filter( 'woocommerce_pagination_args', array( $ins, 'pagination_args' ) );
    add_filter( 'woocommerce_pagination_args', 'sober_child_pagination' );
}

function enqueue_styles() {
    wp_enqueue_style( 'sober-child-theme-style', get_stylesheet_directory_uri() . '/assets/style.css' );
    wp_enqueue_script( 'sober-child-theme-script', get_stylesheet_directory_uri() . '/assets/script.js' );
}

function sober_child_pagination( $args ) {
    $args['prev_text'] = '<img src="' . get_stylesheet_directory_uri() . '/assets/arrow.png" width="20" height="16"> previous';
    $args['next_text'] = 'next <img src="' . get_stylesheet_directory_uri() . '/assets/arrow.png" width="20" height="16">';

    if ( sober_get_option( 'shop_nav_type' ) != 'links' ) {
        $loading           = '<span class="loading-icon"><span class="bubble"><span class="dot"></span></span><span class="bubble"><span class="dot"></span></span><span class="bubble"><span class="dot"></span></span></span>';
        $args['prev_text'] = '';
        $args['next_text'] = '<span class="button-text">' . esc_html__( 'Load More', 'sober' ) . '</span>' . $loading;
    }

    return $args;
}
