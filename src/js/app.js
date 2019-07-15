/**
 * Main JavaScript bundle file. Magic happens here!
 * 
 * Created with plumming love to code.
 * 
 * @version 1.0.0
 * @author Kacper Pruszynski (plumthedev) <contact@kacperpruszynski.pl>
*/

import "bootstrap/dist/js/bootstrap.bundle";
import "./helpers/smooth-scroll";
import "./vendors/slick-carousel/slick";
import "./vendors/lightbox2/lightbox";
import Navbar from "./partials/Navbar"
import Gallery from "./partials/Gallery";

class App {
    constructor() {
        this.navbar = new Navbar();
        this.gallery = new Gallery();
    }
}

new App();