import $ from "jquery";

export default class Navbar {
    constructor() {
        this.navbar = $(".navbar");
        this.showNavbarDistance = 250;
        this.stickyNavbarClassname = "navbar-sticky";
        this.darkNavbarClassname = "navbar-dark";

        this.init = this.init.call(this);
    }

    getUserScrollFromTop() {
        return $(window).scrollTop();
    }

    showNavbar() {
        this.navbar.addClass(this.stickyNavbarClassname);
        this.navbar.addClass(this.darkNavbarClassname);
    }

    hideNavbar() {
        this.navbar.removeClass(this.stickyNavbarClassname);
        this.navbar.removeClass(this.darkNavbarClassname);
    }

    toggleNavbar() {
        const userScroll = this.getUserScrollFromTop();

        if (userScroll >= this.showNavbarDistance) {
            this.showNavbar();
        }

        if (userScroll == 0) {
            this.hideNavbar();
        }
    }

    init() {
        this.toggleNavbar();

        $(window).scroll(() => {
            this.toggleNavbar();
        });
    }
}