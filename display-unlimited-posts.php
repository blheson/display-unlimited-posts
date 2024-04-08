<?php

/**
 * Plugin Name: Display Unlimited Posts
 * Plugin URI: https://blessingudor.com
 * Description: Display a listing of posts using the [display-posts] shortcode
 * Version: 1.0.0
 * Author: Bill Erickson
 * Author URI: https://www.billerickson.net
 *
 * This program is free software; you can redistribute it and/or modify it under the terms of the GNU
 * General Public License version 2, as published by the Free Software Foundation.  You may NOT assume
 * that you can use any other version of the GPL.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
 * even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 *
 * @package Display Unlimited Posts
 * @version 1.0.0
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
		),
		$atts,
		'display-unlimited-posts'
	);

  $script=  '<div id="unlimited_posts_display_posts_shortcode">';
 
        $script .=  '<button data-page="1" data-per_page="'.$atts['posts_per_page'].'" data-post_type="'.$atts['post_type'].'"  data-post_status="'.$atts['post_status'].'" data-post_status="'.$atts['post_status'].'" data-order="'.$atts['order'].'" data-orderby="'.$atts['posts_orderby'].'"  >Load more</button>';
        $script .=  '</div>';

return $script;
}
function  unlimited_posts_enqueue_custom_script() {
    // Enqueue the custom script with a unique handle
    wp_enqueue_script('unlimited_posts_enqueue_custom_script-custom-script', get_template_directory_uri() . '/custom-script.js', array(), '1.0', true);
}
add_action('wp_enqueue_scripts', 'unlimited_posts_enqueue_custom_script');