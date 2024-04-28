<?php

/**
 * Plugin Name: Display Unlimited Posts
 * Plugin URI: https://blessingudor.com
 * Description: Display a listing of posts using the [display-posts] shortcode
 * Version: 1.0.1
 * Author: Blessing Udor
 * Author URI: https://blessingudor.com
 *
 * This program is free software; you can redistribute it and/or modify it under the terms of the GNU
 * General Public License version 2, as published by the Free Software Foundation.  You may NOT assume
 * that you can use any other version of the GPL.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
 * even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 *
 * @package Display Unlimited Posts
 * @version 1.0.2
 * @author Blessing udor <reachme@blessingudor.com>
 * @copyright Copyright (c) 2024, Blessing udor <reachme@blessingudor.com>
 * @link https://blessingudor.com
 * @license http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 */

add_shortcode('display-unlimited-posts', 'unlimited_posts_display_posts_shortcode');
/**
 * Callback for the display-posts shortcode.
 *
 *
 * @param array $atts Shortcode attributes.
 * @return string
 */
function unlimited_posts_display_posts_shortcode($atts)
{

    // Pull in shortcode attributes and set defaults.
    $atts = shortcode_atts(
        array(
            'order'                 => 'DESC',
            'orderby'               => 'date',
            'post_status'           => 'publish',
            'post_type'             => 'post',
            'posts_per_page'        => '12',
                 'cat'        => false,
            // 'meta_key'              =>  "_thumbnail_id"
        ),
        $atts,
        'display-unlimited-posts'
    );

    $body = '<div id="unlimited_posts_display_posts_shortcode"><div class="unlimited_posts-post-card">';
    global $dup_listing;

    $dup_listing = new WP_Query($atts);
    while ($dup_listing->have_posts()) :
        $dup_listing->the_post();
        global $post;
        // start of card
        $body .=  '<div class="listing-item">';
        //image

        $body .= '<a class="unlimited-post-image_link" href="' . get_permalink() . '">' . get_the_post_thumbnail(get_the_ID(), 'medium') . '</a> ';
        //end of image

        //start of title
        $body .= '<a class="unlimited-post-listing-item-title" style="min-height:180px" href="' . apply_filters('the_permalink', get_permalink()) . '">' . get_the_title() . '</a>';
        //end of title
        // start of date
        $body .= '<div class="unlimited-post-listing-item-date" style="position:relative;">

            <span>' . get_the_date('F j, Y') . '</span>
    </div>';
        // end of date
        // end of card
        $body .= '</div>'; //end of card
    endwhile;
    wp_reset_postdata();
    $body .=  '</div>'; //end of class unlimited_posts-post-card
    $body .= '<div class="unlimited-posts-button-wrapper"><button data-page="2" data-per_page="' . $atts['posts_per_page'] . '" data-post_type="' . $atts['post_type'] . '"  data-post_status="' . $atts['post_status'] . '" data-post_status="' . $atts['post_status'] . '" data-order="' . $atts['order'] . '" data-orderby="' . $atts['orderby'] . '" data-metakey="' . $atts['meta_key'] . '" onclick="UnlimitedPostPluginInitLoadMore()">Load more</button></div>';
    $body .=  '</div>';

    return $body;
}
function  unlimited_posts_enqueue_custom_script()
{
    // Enqueue the custom script with a unique handle
    wp_enqueue_script('unlimited_posts_enqueue_custom_script-custom-script', plugins_url('display-unlimited-posts/assets/js/main.js'), array(), '1.0.4', true);
}
add_action('wp_enqueue_scripts', 'unlimited_posts_enqueue_custom_script');
// Enqueue stylesheet function
function unlimited_posts_enqueue_custom_style()
{
    // Enqueue the custom stylesheet with a unique handle
    wp_enqueue_style('unlimited_posts_enqueue_custom_script-custom-style', plugins_url('display-unlimited-posts/assets/css/main.css'), array(), '1.0.1', 'all');
}
add_action('wp_enqueue_scripts', 'unlimited_posts_enqueue_custom_style');



add_action('rest_api_init', 'unlimited_posts_ws_register_images_field');

function unlimited_posts_ws_register_images_field()
{
    register_rest_field(
        'post',
        'attachment_url_image',
        array(
            'get_callback'    => 'unlimited_posts_ws_get_images_urls',
            'update_callback' => null,
            'schema'          => null,
        )
    );
}

function unlimited_posts_ws_get_images_urls($object, $field_name, $request)
{

    $medium = wp_get_attachment_image_src(get_post_thumbnail_id($object['id']), 'medium');
    if (is_array($medium)) {
        return isset($medium['0']) ? $medium['0'] : '';
    }
    return '';
}