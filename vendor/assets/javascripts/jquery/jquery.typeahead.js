(function($) {
    
    $.fn.typeahead = function(options) {
        options = $.extend({}, $.fn.typeahead.defaults, options);
        
        function TypeAhead(input, options) {
            var api = this
            
            var container = null
            var ul = null
            var jsp = null
            
            var items = []
            var uiItems = []
            var selectedIndex = null
            
            var searchTimer = null
            var scrollBarTimer = null
            var railOver = false
            var dragging = false
            
            var previousValue = ""
            var disabled = false
            
            function enable() {
                disabled = false
            }
            
            function disable() {
                disabled = true
            }
            
            function isEmpty() {
                return (input.val() == '')
            }
            
            function positionContainer() {
                if(container == null || ul == null) return
                var offset = input.offset()
                var resultWrapper = $('.js-instant_search_results')
                var ulMaxHeight = 0.66 * $(window).height()
                var ulMaxHeightWithFewResults = 0
                container.css("top", (offset.top + input.height() + options.padding.top))
                    .css("left", offset.left + options.padding.left)
                resultWrapper.children('li').each(function (){
                    ulMaxHeightWithFewResults += $(this).outerHeight()
                })
                if (ulMaxHeightWithFewResults < ulMaxHeight) {
                    ulMaxHeight = ulMaxHeightWithFewResults
                }
                ul.css('max-height', ulMaxHeight + 'px')
                $('.jspContainer').height($('.jspPane').height())
                initializeScrollBar(ul)
            }
            
            function open() {
                if(container == null || ul == null || disabled == true || isEmpty() == true) return
                container.show()
                positionContainer()
                if(options.open) options.open(api, container, ul, jsp)
                showScrollBar(true)
            }
            
            function close() {
                if(container == null || ul == null) return
                if(!container.is(':visible')) return
                if(container) container.hide()
                if(options.close) options.close(api, container, ul, jsp)
            }
            
            function select(index, isKey) {
                if(items.length == 0) return
                
                var currentUiItem = uiItems[selectedIndex]
                if(currentUiItem != null) currentUiItem.removeClass('focus')
                selectedIndex = null
                if(index == null) {
                    if(isKey) jsp.scrollToY(0)
                    if(options.focus) options.focus(api, index, item, uiItem)
                    return
                }
                
                var item = items[index]
                var uiItem = uiItems[index]
                uiItem.addClass('focus')
                selectedIndex = index
                if(isKey) {
                    if(index == 0) jsp.scrollToY(0)
                    else jsp.scrollToElement(uiItem)
                }
                if(options.focus) options.focus(api, index, item, uiItem)
            }
            
            function keyUp() {
                if(selectedIndex == null) select(items.length - 1, true)
                else if(selectedIndex == 0) select(null, true)
                else select(selectedIndex - 1, true)
            }
            
            function keyDown() {
                if(selectedIndex == null) select(0, true)
                else if(selectedIndex == items.length - 1) select(null, true)
                else select(selectedIndex + 1, true)
            }
            
            function clicked(event, index) {
                if(index == null) return
                var item = items[index]
                var itemUrl = item.find('a').attr('href')
                if(options.select) options.select(itemUrl)
                close()
                event.preventDefault()
            }

            function enterPress(event, index) {
                if (options.enterPress) {
                    var query = input.val()
                    if (query.length == 0) {
                        return
                    }
                    options.enterPress(query);
                    close()
                    event.preventDefault()
                    return;
                }
                clicked(event, index)
            }
            
            function search() {
                if(disabled == true) return
                var query = input.val()
                if(query.length == 0) {
                    close()
                    return
                }
                options.source(query, response)
            }
            
            function response(data) {
                if(input.val() == '') return close()
                items = data
                uiItems = []
                if(container == null) {
                    container = $('<div class="typeahead-container"></div>')
                    ul = $('<ul class="typeahead-list"></ul>').appendTo(container)
                    container.hide()
                    $(document.body).append(container)
                    initializeScrollBar(ul)
                }
                var jspPane = jsp.getContentPane()
                jspPane.empty()
                
                selectedIndex = null
                
                if (typeof data === 'undefined') {
                    jspPane.append(options.error.addClass('typeahead-item'));
                } else if(items.length == 0) {
                    jspPane.append(options.emptyItem.addClass('typeahead-item'));
                } else {
                    jspPane.append(data)
                    var renderedItems = jspPane.find('.typeahead-item');
                    $.each(renderedItems, function (index, item) {
                        item = $(item);
                        item.mouseover(function() { select(index) })
                            .mouseout(function() { select(null) })
                            .click(function(event) { clicked(event, index) })

                        uiItems.push(item)
                    })
                    items = uiItems;
                    
                    if(options.autoFocus == true) select(0)
                    else selectedIndex = null
                }
                
                open()
                jsp.scrollToY(0, false)
            }
            
            function initializeScrollBar(ul) {
                if(jsp) {
                    jsp.reinitialise()
                }
                else {
                    jsp = ul.jScrollPane({
                        verticalGutter: 0,
                        animateScroll: true,
                        animateDuration: 100,
                        contentWidth: '0px'
                    }).data('jsp')
                }
                
                $('.jspScrollable').mouseenter(function(){
                    showScrollBar(true)
                }).mouseleave(function(){
                    hideScrollBar(500)
                })
                
                $('.jspTrack').mouseenter(function() {
                    railOver = true
                    showScrollBar(false)
                }).mouseleave(function() {
                    railOver = false
                    hideScrollBar(500)
                })
                
                $('.jspDrag').mousedown(function(event, ui) {
                    dragging = true
                })
                
                $('.jspPane').bind("mousewheel", function(event, delta) {
                    showScrollBar(true)
                }).bind("touchmove", function(event) {
                    showScrollBar(true)
                })
            }
            
            function showScrollBar(hide) {
                if(scrollBarTimer != null) {
                    clearTimeout(scrollBarTimer)
                    scrollBarTimer = null
                }
                $('.jspDrag').fadeIn()
                if(hide == true && railOver == false && dragging == false) scrollBarTimer = setTimeout(hideScrollBar, 1500)
            }
            
            function hideScrollBar(timer) {
                if(scrollBarTimer) clearTimeout(scrollBarTimer)
                scrollBarTimer = null
                if(timer) scrollBarTimer = setTimeout(hideScrollBar, timer)
                else if(railOver == false && dragging == false) $('.jspDrag').fadeOut()
            }
            
            function handleMouseUp(event, touch) {
                if (container && container.has(event.target).length === 0 && (touch == true || input.is(':focus') == false)) {
                    container.hide()
                }
                if(dragging == true) {
                    dragging = false
                    hideScrollBar()
                } else {
                    dragging = false
                }
            }
            
            $(document).mouseup(function(event) { handleMouseUp(event) })
            $(document).bind("touchend", function(event) { handleMouseUp(event, true) })
            
            input.val(options.placeholder)
            input.focus(function() {
                if(input.val() == options.placeholder){
        			input.val('')
        		}
        		else {
        		    search()
        		}
            })
            input.blur(function() {
                if(input.val() == ''){
        			input.val(options.placeholder)
        		}
            })
            
            input.keydown(function(event) {
                switch(event.keyCode) {
                    case 38: // up arrow
                        keyUp()
                        showScrollBar(true)
                        event.preventDefault()
                    break
                    case 40: // down arrow
                        keyDown()
                        showScrollBar(true)
                        event.preventDefault()
                    break
                }
            })
            
            input.keyup(function(event) {
                switch(event.keyCode) {
                    case 38: // up arrow
                    case 40: // down arrow
                        event.preventDefault()
                    break
                    
                    case 27: // escape
                        input.blur()
                        close()
                    break
                    
                    case 13: // enter
                        if(isEmpty() == true) return
                        enterPress(event, selectedIndex)
                    break
                    
                    default:
                    {
                        var value = input.val()
                        if(value != previousValue) {
                            if(searchTimer != null) {
                                clearTimeout(searchTimer)
                                searchTimer = null
                            }
                            searchTimer = setTimeout(search, options.delay)
                            previousValue = value
                        }
                    }
                    break
                }
            })
            
            $(window).resize(function() {
                positionContainer()
            })
            
            // API
            $.extend(api, {
                enable: function() {
                    enable()
                },
                disable: function() {
                    disable()
                },
                isEnabled: function() {
                  return (disabled == false)
                },
                search: function() {
                    search()
                },
                open: function() {
                    open()
                },
                close: function() {
                    close()
                }
            })
        }
        
        return this.each(function() {
            var input = $(this)
            var api = input.data('api')
			if (api) {
			    
			} else {
				api = new TypeAhead(input, options)
				input.data('api', api)
			}
        })
    }
    
    $.fn.typeahead.defaults = {
        placeholder: "",
        delay: 200,
        autoFocus: true,
        emptyItem: $("<li>No results</li>"),
        padding: {
            top: 0,
            left: 0
        }
    }
    
})(jQuery)
