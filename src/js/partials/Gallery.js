/**
 * Gallery.
 * 
 * Use lightbox2 and Slick Carousel to work.
 * 
 * lightbox2 is initialized by [data-lightbox="akka-gallery"]
 *  
 * Created with plumming love to code.
 * 
 * @version 1.0.0
 * @author Kacper Pruszynski (plumthedev) <contact@kacperpruszynski.pl>
*/

import $ from "jquery";
import galleryCarouselConfig from "./../config/gallery-carousel-config";

export default class Gallery{
    constructor(){
        this.carousel = $('.gallery-carousel');

        this.initCarousel = this.initCarousel.call(this)
    }

    initCarousel(){
        this.carousel.slick(galleryCarouselConfig);
    }
}