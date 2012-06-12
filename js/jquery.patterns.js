// 
(function($) {
    /* require jquery 1.7+ */
    $.fn.patternPlugin = function() {

        "use strict";

        return this.each(function() {
            // pattern site urls
            var baseurl = "http://amc2.pori.tut.fi",
            liburl = "/educational-game-design-patterns/pattern-cloud";

            var $this = $(this);
            
            // make pattern request
            var jqxhr = $.ajax({
                url: baseurl + liburl,
                cache: true,
                beforeSend: function() {
                    $this.text('loading patterns...');
                }
            });
            // request successful -> create dom elements
            jqxhr.done(function(data) {

                var $data = $(data);

                var patterns = [];
                
                // dom root from request dom
                var $root = $data.find('.view-pattern-cloud');

                // add patterns to array
                $root.find('.views-row').each(function(index) {

                    var $link = $(this).find('a');

                    var title = $link.text();
                    var url = $link.attr('href');

                    patterns.push({
                        "title": title,
                        "url": baseurl + url
                    });

                });

                // if patterns was found
                if (patterns.length) {
                    // wrapper for the hole thing
                    var $form = $('<div/>', {
                        class: 'pattern-row'
                    });
                    // label for select box
                    $('<label/>', {
                        for: 'patterns',
                        text: 'Select Pattern(s)'
                    }).appendTo($form);
                    // select box
                    var $select = $('<select/>', {
                        id: 'patterns',
                        multiple: 'multiple'
                    });
                    // add each pattern as option in select box
                    $.each(patterns, function(index, pattern) {
                        $("<option/>", {
                            value: pattern.url,
                            text: pattern.title
                        }).appendTo($select);
                    });

                    $select.appendTo($form);
                    // selected patterns list
                    var $selectedList = $("<ul/>", {
                        class: "selected-patterns"
                    }).appendTo($form);

                    $this.empty().append($form);
                    
                    // bind change value event to select box and add 
                    // selected to selected patterns list
                    $select.on("change", function(event) {
                        var $tgt = $(event.target);

                        var $ul = $(".selected-patterns").empty();

                        $tgt.find("option:selected").each(function(index) {
                            var $li = $("<li/>");
                            $("<a/>", {
                                text: $(this).text(),
                                title: $(this).text(),
                                href: $(this).val(),
                                target: "_blank"
                            }).appendTo($li);

                            $li.appendTo($ul);

                        });
                    }).change();

                } else {
                    // no patterns was found from request
                    $this.text("error! no patterns found.")
                }

            });

            // something went wrong with ajax request
            jqxhr.fail(function() {
                $this.text('error! loading failed.');
            });
        });
    };
})(jQuery);
