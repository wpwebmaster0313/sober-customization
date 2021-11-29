'use strict';
window.Olek || (window.Olek = {});

(function ($) {
    /**
     * Hash Scroll 
     * 
     * @since 1.4.0
     */
    Olek.SectionScroll = {
        initialize: function () {
            this.events();
            return this;
        },
        getTarget: function (href) {
            if ('#' == href || href.endsWith('#')) {
                return false;
            }
            var target;

            if (href.indexOf('#') == 0) {
                target = $(href);
            } else {
                var url = window.location.href;
                url = url.substring(url.indexOf('://') + 3);
                if (url.indexOf('#') != -1)
                    url = url.substring(0, url.indexOf('#'));
                href = href.substring(href.indexOf('://') + 3);
                href = href.substring(href.indexOf(url) + url.length);
                if (href.indexOf('#') == 0) {
                    target = $(href);
                }
            }
            return target;
        },
        events: function () {
            var self = this,
                adminBarHeight = 0,
                stickyHeaderHeight = 0;

            if ($('#wpadminbar').length > 0) {
                adminBarHeight = $('#wpadminbar').outerHeight();
            }

            $('.sticky-content.fix-top').each(function () {
                stickyHeaderHeight += this.offsetHeight;
            });

            $('.menu-item > a[href*="#"]').on('click', function (e) {
                e.preventDefault();

                var $this = $(this),
                    href = $this.attr('href'),
                    target = self.getTarget(href);

                if (0 !== $this.closest('.elementor-section').length) {
                    return;
                }

                if (target && target.get(0)) {
                    var $parent = $this.parent();

                    var scroll_to = target.offset().top - stickyHeaderHeight - adminBarHeight;

                    $('html, body').stop().animate({
                        scrollTop: scroll_to
                    }, 600, 'linear', function () {
                        $parent.siblings().removeClass('active');
                        $parent.addClass('active');
                    });
                } else if (('#' != href) && !$this.hasClass('nolink')) {
                    window.location.href = $this.attr('href');
                }
            });

            var $menu_items = $('.menu-item > a[href*="#"]');
            $menu_items.each(function () {
                var rootMargin = '-20% 0px -79.9% 0px',
                    isLast = $(this).parent().is(':last-child');
                if (isLast) {
                    var obj = document.getElementById(this.hash.replace('#', ''));
                    if (obj && document.body.offsetHeight - obj.offsetTop < window.innerHeight) {
                        var ratio = (window.innerHeight - document.body.offsetHeight + obj.offsetTop) / window.innerHeight * 0.8;
                        ratio = Math.round(ratio * 100);
                        rootMargin = '-' + (20 + ratio) + '% 0px -' + (79.9 - ratio) + '% 0px';
                    }
                }
                var callback = function () {
                    if (this && typeof this[0] != 'undefined' && this[0].id) {
                        $('.menu-item > a[href*="#' + this[0].id + '"]').parent().addClass('active').siblings().removeClass('active');
                    }
                };
                self.scrollSpyIntObs(this.hash, callback, {
                    rootMargin: rootMargin,
                    thresholds: 0
                }, true, isLast, true, $menu_items, $(this).parent().index());
            });

            return self;
        },

        /**
         * Scroll Spy with IntersectionObserver
         * 
         * @since 1.4.0
         */
        scrollSpyIntObs: function (selector, functionName, intObsOptions, alwaysObserve, isLast, firstLoad, $allItems, index) {
            if (typeof IntersectionObserver == 'undefined') {
                return this;
            }
            var obj = document.getElementById(selector.replace('#', ''));
            if (!obj) {
                return this;
            }

            var self = this;

            var intersectionObserverOptions = {
                rootMargin: '0px 0px 200px 0px'
            }

            if (Object.keys(intObsOptions).length) {
                intersectionObserverOptions = $.extend(intersectionObserverOptions, intObsOptions);
            }

            var observer = new IntersectionObserver(function (entries) {

                for (var i = 0; i < entries.length; i++) {
                    var entry = entries[i];
                    if (entry.intersectionRatio > 0) {
                        if (typeof functionName === 'string') {
                            var func = Function('return ' + functionName)();
                        } else {
                            var callback = functionName;

                            callback.call($(entry.target));
                        }
                    } else {
                        if (firstLoad == false) {
                            if (isLast) {
                                $allItems.filter('[href*="' + entry.target.id + '"]').parent().prev().addClass('active').siblings().removeClass('active');
                            }
                        }
                        firstLoad = false;

                    }
                }
            }, intersectionObserverOptions);

            observer.observe(obj);

            return this;
        },
    }
    $(window).on('load', function () {
        Olek.SectionScroll.initialize();
    });
})(jQuery);