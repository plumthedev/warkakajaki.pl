import $ from "jquery";
import galleryCarouselConfig from "./../config/gallery-carousel-config";

$(document).ready(function () {
    $('.gallery-carousel').slick(galleryCarouselConfig);
});