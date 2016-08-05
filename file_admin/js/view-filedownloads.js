jQuery.extend({
    /**
     * @class      filedownloads.View
     * @namespace  filedownloads
     * @extend     jQuery     
     * @description    
     * The View handles the data presentation for the application. 
     *     
     * @constructor
     *       
     * @author     Kevin Torbett
     * @version    0.0.1
     * @history  
     * <p>
     * version   0.0.1 {Kevin} <br/>
     * &nbsp; - initial creation<br/>
     * </p> 
     * <br/>    
     *    
     * @example 
     * new jQuery.View()<br/>   
     */
    View: function() {
        /**
         * Self reference for internal use only. (that = this)   
         *       
         * @property   that
         * @private     
         * @type      (Object)	   
         */

        /**
         * @private           
         * @property  listeners 
         * @type      (Object) 
         *
         * A config object containing one or more event handlers to be added to this
         * object.  
         */

        /**
         * @private           
         * @property  su
         * @type      (Boolean) 
         *
         * super user flag
         */
        var that = this;
        var listeners = [];
        var su = false;
        var mapper = '';
        var cont_type = '';
        var sub_type = '';
        var desc_type = '';
        var supplier = '';
        var grid_current_pages = {};
        var grid_page_totals = {};
        var grid_intervals = {};


        //----- Private Methods -----//  

        /**
         * move Menu View object to the Center Container
         * 
         * @private             
         * @method		moveToCenterContainer
         * @param     	(Object)    p_item      view object
         */
        function moveToCenterContainer(p_item) {
            p_item.fadeOut(function() {
                p_item
                    .resizable('destroy')
                    .clone(true)
                    .resizable({
                        disabled: false
                    })
                    .appendTo('#display')
                    .fadeIn(function() {
                        p_item.remove();
                    })
                    .find(".portlet-header .port-icon-switch")
                    .unbind('click')
                    .click(function() {
                        moveToViewsContainer(jQuery(this).parents('.portlet'));
                        jQuery(this)
                            .toggleClass("ui-icon-arrowthick-1-e")
                            .toggleClass("ui-icon-arrowthick-1-w");
                    });
            });
        }

        /**
         * move Menu View object to the Menu Container
         * 
         * @private             
         * @method		moveToViewsContainer
         * @param     	(Object)    p_item      view object
         */
        function moveToViewsContainer(p_item) {
            p_item.fadeOut(function() {
                p_item
                    .resizable('destroy')
                    .attr({
                        style: ''
                    })
                    .clone(true)
                    .appendTo('#menu')
                    .fadeIn(function() {
                        p_item.remove();
                    })
                    .find(".portlet-header .port-icon-switch")
                    .unbind('click')
                    .click(function() {
                        moveToCenterContainer(jQuery(this).parents('.portlet'));
                        jQuery(this)
                            .toggleClass("ui-icon-arrowthick-1-e")
                            .toggleClass("ui-icon-arrowthick-1-w");
                    });
            });
        }

        /**
         * Initialize context menu
         * 
         * @private             
         * @method		initializeContextMenu
         * @param     	(String)    p_name      id name of the DOM to attach the menu to                    
         */
        function initializeContextMenu(p_name) {
            var l_name = (p_name) ? '#' + p_name : window;
            jQuery(l_name).contextMenu(getContextMenuItems(p_name), getContextMenuOptions(p_name));
        }

        /**
         * Get the context menu options based on the type
         * 
         * @private             
         * @method    
         * @param       (String)    p_name      id name of the DOM to attach the menu to       
         *     		 
         * @return      (Object)    context menu option object
         */
        function getContextMenuOptions(p_name) {
            switch (p_name) {
                default: return {
                    theme: 'vista',
                    shadowColor: 'black',
                    shadowOffsetX: 2,
                    shadowOffsetY: 2,
                    shadowWidthAdjust: 2,
                    shadowHeightAdjust: 2,
                    beforeShow: function() {
                        return true;
                    }
                }
            }
        }

        /**
         * Get the context menu items object
         * 
         * @private             
         * @method    
         * @param     (String)    p_name      id name of the DOM to attach the menu to    
         *       		 
         * @return    (Object)    array of context menu items          
         */
        function getContextMenuItems(p_name) {
            switch (p_name) {
                default: return [
                    getMsgAlertContextMenuObject()
                ];
            }
        }


        /* Menu items start */
        /**
         * Get the message alert context menu item object
         * 
         * @private             
         * @method         
         */
        function getMsgAlertContextMenuObject() {
            return ({
                '': {
                    title: 'reload this application',
                    icon: './images/icon/refresh_16x16.png',
                    onclick: function() {
                        location.reload();
                    }
                }
            });
        }


        /* Menu items end */


        /**
         * Gets the default tool tip options. it also allows for additional options.  
         * 
         * @private        
         * @method         
         * @param         (Object)      p_opts    tool tip options object
         */
        function getTooltipOptions(p_opts) {
            var l_opts = (p_opts) ? p_opts : {};
            return (jQuery.extend({
                fill: 'rgba(0, 0, 0, .8)',
                strokeStyle: '#CC0',
                cssStyles: {
                    color: '#FFF',
                    fontWeight: 'bold'
                }
            }, l_opts));
        }

        /**
         * Creates a standard message file
         * 
         * @note
         * p_type:     
         *  0 = normal
         *  1 = alert
         *  2 = danger      
         *  3 = bypass the standard look
         *               
         * @private
         * @method 
         * @param     (Integer)       p_type    
         * @return    (String)       html                             
         */
        function standardizeMessage(p_type, p_msg, p_ext_msg) {
            var l_type = (isNaN(p_type)) ? 'skip' : p_type;
            if (l_type == 'skip') {
                return (p_msg + ' ' + addExtraMessage(p_ext_msg));
            }
            switch (p_type) {
                case 1:
                    l_type = './images/alerts/alert.png';
                    break;

                case 2:
                    l_type = './images/alerts/danger.png';
                    break;

                case 3: //bypass
                    return (p_msg);
                    break;

                case 4:
                    l_type = './images/alerts/question.png';
                    break;

                default:
                    l_type = './images/alerts/info.png';
            }
            return ('<span style="float:left; margin:0 7px 50px 0;">' +
                '<img width="32px" height="32px" src="' + l_type + '"/></span>' +
                '<div id="msg_dlg_file">' + p_msg + '</div>' + addExtraMessage(p_ext_msg));
        }


        /**
         * Adds extra file to the dialog
         *      
         * @private     
         * @method		addExtraMessage
         * @param       (String)      p_msg       extra message file
         * @returns		(String)	  HTML
         */
        function addExtraMessage(p_msg) {
            if (p_msg.length >= 100) {
                return '<div id="lnk_details_container">' +
                    '<a href="#" value="More Details" id="lnk_details">More Details</a>' +
                    '</div>' +
                    '<div style="float:left;" id="ext_msg_details">' + p_msg + '</div>';
            } else {
                return '<div style="display:block; margin:10px 10px 0;">' + p_msg + '</div>';
            }
        }

        /**
         * Setup the north file and events
         *      
         * @private     
         * @method    setupNorthfile
         * @param     (Objects)     p_roles      user roles     
         */
        function setupNorthfile(p_roles) {
            addNorthfileTabMenu(p_roles);
            addNorthfileMenu()
            addNorthfileTabMenuEvent(p_roles);
        }

        /**
         * Setup the center file and events
         *      
         * @private     
         * @method    setupCenterfile
         * @param     (Objects)     p_roles      user roles     
         */
        function setupCenterfile(p_roles) {
            addCenterfile(p_roles);
        }

        /**
         * Add Tab Menu
         *
         * @private
         * @method      addNorthfileTabMenu
         * @param       (Object)      p_roles     user roles     
         */
        function addNorthfileTabMenu(p_roles) {
            //   var l_valid = isUserRoleValid('METADATA_CREATE', p_roles);

            //    l_valid = isUserRoleValid('CONTENT_MANAGER_READ', p_roles);
            var l_file_panel =
                "<div id=\"menu_file_manager\">" +
                '<div id="mnu_dash">' +
                '<input type="radio" id="but_vcdb" name="mnu_dash" class="file-file-button" checked="checked" /><label for="but_vcdb">VCDB</label>' +
                '<input type="radio" id="but_pcdb" name="mnu_dash" class="file-file-button" /><label for="but_pcdb">PCDB</label>' +
                '<input type="radio" id="but_qdb" name="mnu_dash" class="file-file-button" /><label for="but_qdb">QDB</label>' +
                '<input type="radio" id="but_map" name="mnu_dash" class="file-file-button" /><label for="but_map">Epicor Vehicle Map</label>' +

                '</div>' +
                "</div> ";

            var l_file_tab =
                "<li id=\"file_tab\"><a href=\"#menu_file_manager\">file Manager</a></li> ";

            var l_html = l_file_panel;

            jQuery("#north_pane").append(l_html);
        }



        /**
         * menu buttons
         *      
         * @private     
         * @method      addNorthfileMenu
         * @return      HTML      VCDB/PCDB/QDB Buttons     
         */
        function addNorthfileMenu() {
            return '<div id="mnu_dash">' +
                '<input type="radio" id="but_vcdb" name="mnu_dash" class="file-file-button" checked="checked" /><label for="but_vcdb">VCDB</label>' +
                '<input type="radio" id="but_pcdb" name="mnu_dash" class="file-file-button" /><label for="but_pcdb">PCDB</label>' +
                '<input type="radio" id="but_qdb" name="mnu_dash" class="file-file-button" /><label for="but_qdb">QDB</label>' +
                '<input type="radio" id="but_map" name="mnu_dash" class="file-file-button" /><label for="but_map">Epicor Vehicle Map</label>' +

                '</div>';
        }

        /**
         * Add Tab Menu Events
         *
         * @private
         * @method     addNorthfileTabMenuEvent
         * @param     (Object)        p_roles           user roles      
         */
        function addNorthfileTabMenuEvent(p_roles) {
            //tabs
            jQuery(".ui-layout-north")
                .tabs({
                    selected: 0,
                    select: function(p_event, p_ui) {
                        //clear the containers (dialog)
                        //    that.closeDialog();
                        selectfilePanel(p_ui.index, p_roles);
                    }
                });


            addNorthfileMenuEvents();
        }

        /**
         * Add file Menu Events
         *
         * @private
         * @method      addNorthfileMenuEvents
         */
        function addNorthfileMenuEvents() {
            jQuery('#mnu_dash')
                .attr('view', 'vcdb')
                .buttonset();

            //pcdb button
            jQuery('#but_pcdb')
                .click(function() {
                    if (jQuery('#mnu_dash').attr('view') === 'pcdb') {
                        return false;
                    }

                    jQuery('#mnu_dash').attr('view', 'pcdb');
                    showMainOverlay('Fetching file...', 150, 50)
                    destroyGrid('file_vcdb');
                    destroyGrid('file_qdb');
                    destroyGrid('file_map');
                    var l_page = grid_current_pages['file_pcdb'] ? grid_current_pages['file_pcdb'] : 1;
                    var l_max = grid_intervals['file_pcdb'] ? grid_intervals['file_pcdb'] : 10;
                    that.notifyFetchfileData({
                        grid_name: 'file_pcdb',
                        grid_container: jQuery('#file_manager_master')
                    }, {
                        max: l_max,
                        offset: ((l_page - 1) * l_max)
                    });
                });

            //vcdb button
            jQuery('#but_vcdb')
                .click(function() {
                    if (jQuery('#mnu_dash').attr('view') === 'vcdb') {
                        return false;
                    }

                    jQuery('#mnu_dash').attr('view', 'vcdb');
                    showMainOverlay('Fetching file...', 150, 50)
                    destroyGrid('file_pcdb');
                    destroyGrid('file_qdb');
                    destroyGrid('file_map');
                    //fetch the data  
                    var l_page = grid_current_pages['file_vcdb'] ? grid_current_pages['file_vcdb'] : 1;
                    var l_max = grid_intervals['file_vcdb'] ? grid_intervals['file_vcdb'] : 10;
                    that.notifyFetchfileData({
                        grid_name: 'file_vcdb',
                        grid_container: jQuery('#file_manager_master')
                    }, {
                        max: l_max,
                        offset: ((l_page - 1) * l_max)
                    });
                });
            //qcdb button
            jQuery('#but_qdb')
                .click(function() {
                    if (jQuery('#mnu_dash').attr('view') === 'qdb') {
                        return false;
                    }

                    jQuery('#mnu_dash').attr('view', 'qdb');
                    showMainOverlay('Fetching file...', 150, 50)
                    destroyGrid('file_vcdb');
                    destroyGrid('file_pcdb');
                    destroyGrid('file_map');
                    //fetch the data  
                    var l_page = grid_current_pages['file_qdb'] ? grid_current_pages['file_qdb'] : 1;
                    var l_max = grid_intervals['file_qdb'] ? grid_intervals['file_qdb'] : 10;
                    that.notifyFetchfileData({
                        grid_name: 'file_qdb',
                        grid_container: jQuery('#file_manager_master')
                    }, {
                        max: l_max,
                        offset: ((l_page - 1) * l_max)
                    });
                });
            jQuery('#but_map')
                .click(function() {
                    if (jQuery('#mnu_dash').attr('view') === 'map') {
                        return false;
                    }

                    jQuery('#mnu_dash').attr('view', 'map');
                    showMainOverlay('Fetching file...', 150, 50)
                    destroyGrid('file_vcdb');
                    destroyGrid('file_pcdb');
                    destroyGrid('file_qdb');
                    destroyGrid('file_map');
                    //fetch the data  
                    var l_page = grid_current_pages['file_map'] ? grid_current_pages['file_map'] : 1;
                    var l_max = grid_intervals['file_map'] ? grid_intervals['file_map'] : 10;
                    that.notifyFetchfileData({
                        grid_name: 'file_map',
                        grid_container: jQuery('#file_manager_master')
                    }, {
                        max: l_max,
                        offset: ((l_page - 1) * l_max)
                    });
                });
        }



        /**
         * Add the center file HTML
         *      
         * @private     
         * @method    addCenterfile
         */
        function addCenterfile() {
            var l_html = '<div id="file_manager_master"></div>';
            jQuery("#center_file").append(l_html);
        }

        /**
         * Destroy's the grid object 
         *     	  
         * @private     
         * @method    destroyGrid
         * @param    (String)     p_name     grid name    
         */
        function destroyGrid(p_name) {
            jQuery("#" + p_name + "_Grid")
                .jqGrid('GridDestroy');
        }

        /**
         * Cleans the center file 
         *
         * @private     
         * @method    cleanfilePanel
         */
        function cleanfilePanel() {
            if (jQuery('#main_dialog').dialog('isOpen')) {
                jQuery('#main_dialog').dialog('close');
            }

            destroyGrid('data_files');

            jQuery('#center_file')
                .empty()
                .html('<div id="file_manager_master"></div>');
        }


        /**
         *
         * @private
         * @method     createDataSourcefileDiv
         * @param     (Object)        p_roles           user roles      
         */
        function createDataSourcefileDiv(p_roles) {

            jQuery('#file_manager_detail').empty();
            var l_html = '<div class="upload-meta hideme" id="file_manager_detail_container" >' +
                '<div class="ds-file-hdr"><h1 class="ds-file-hdr-title">Data Source file</h1></div>' +
                '<div id="file_manager_detail">' +
                '<div id="ds_buttons">' +
                '</div>' +
                '<div id="file_data_detail" class="datasource-file-container"></div>' +
                '</div>' +
                '</div>';
            jQuery('#center_file').append(l_html);
            jQuery('.comment-btn').button();
        }


        /**
         * Changes the center file panel based on the menu tab selection 
         *
         * @private     
         * @method     selectfilePanel
         * @param     (Integer)       p_tab_index       menu tab index 
         * @param     (Object)        p_roles           user roles     
         */
        function selectfilePanel(p_tab, p_roles) {
            alert('gg')
            cleanfilePanel();
            switch (p_tab) {
                case 0: // file
                    jQuery('#mnu_dash')
                        .children('#but_vcdb')
                        .attr({
                            checked: true
                        })
                        .end()
                        .attr({
                            view: 'vcdb'
                        })
                        .button('destroy')
                        .buttonset();

                    showMainOverlay('Fetching file...', 150, 50);
                    //fetch the data  
                    var l_page = grid_current_pages['file_vcdb'] ? grid_current_pages['file_vcdb'] : 1;
                    var l_max = grid_intervals['file_vcdb'] ? grid_intervals['file_vcdb'] : 10;
                    that.notifyFetchfileData({
                        grid_name: 'file_vcdb',
                        grid_container: jQuery('#file_manager_master')
                    }, {
                        max: l_max,
                        offset: ((l_page - 1) * l_max)
                    });
                    break;



                default:
                    //
            }
        }



        /**
         * Converts the single digit number value to two digit
         * @note
         *  2 = 02;  
         *               
         * @private     
         * @method    setTwoDigits
         * @param     (Integer)   p_val
         * @return     p_val      
         */
        function setTwoDigits(p_val) {
            if (p_val.toString().length < 2) {
                return '0' + p_val.toString();
            }
            return p_val;
        }

        /**
         * Returns the current date formatted xx/xx/xxxx
         * 
         * @private     
         * @method    getCurrentDateFormatted
         * @return    (String)    formatted date     
         */
        function getCurrentDateFormatted() {
            var l_date = new Date();
            var l_mn = l_date.getMonth() + 1;
            var l_dy = l_date.getDate();
            var l_yr = l_date.getFullYear();

            return (setTwoDigits(l_mn) + '/' + setTwoDigits(l_dy) + '/' + l_yr);
        }



        /**
         * Handles the window resize event
         *      
         * @private     
         * @method	setupWindowResizeEvent
         */
        function setupWindowResizeEvent() {
            /*jQuery(window).resize(function(){ 
              if (jQuery("#fetch_int").length==1){
                jQuery('#msg_settings').btOn();
                jQuery("#fetch_int").val(that.getFetchInterval());
                jQuery('#but_setit')
                  .unbind('click')
                  .bind('click', function (){
                    that.setFetchInterval(jQuery("#fetch_int").val(),true);
                  });
                  
              }
            });   */
        }

        /**
         * Layout options
         *      
         * @private     
         * @method		getLayoutOptions
         */
        function getLayoutOptions() {
            return {
                name: "outerLayout", // NO FUNCTIONAL USE, but could be used by custom code to 'identify' a layout
                defaults: getDefaultLayoutOptions(),
                north: getNorthLayoutOptions(),
                center: getCenterLayoutOptions()
            };
        }

        /**
         * Get the default layout options
         *      
         * @private     
         * @method	getDefaultLayoutOptions
         */
        function getDefaultLayoutOptions() {
            return { // options.defaults apply to ALL PANES - but overridden by pane-specific settings
                size: "auto",
                minSize: 35,
                paneClass: "pane", // default = 'ui-layout-pane'
                resizerClass: "resizer", // default = 'ui-layout-resizer'
                togglerClass: "toggler", // default = 'ui-layout-toggler'
                buttonClass: "button", // default = 'ui-layout-button'
                fileSelector: ".file", // inner div to auto-size so only it scrolls, not the entire pane!
                fileIgnoreSelector: "span", // 'paneSelector' for file to 'ignore' when measuring room for file
                togglerLength_open: 35, // WIDTH of toggler on north/south edges - HEIGHT on east/west edges
                togglerLength_closed: 35, // "100%" OR -1 = full height
                hideTogglerOnSlide: true, // hide the toggler when pane is 'slid open'
                togglerTip_open: "Close This Pane",
                togglerTip_closed: "Open This Pane",
                resizerTip: "Resize This Pane",
                fxName: "slide", // none, slide, drop, scale
                fxSpeed_open: 500,
                fxSpeed_close: 1000,
                fxSettings_open: {
                    easing: "easeInQuint"
                },
                fxSettings_close: {
                    easing: "easeOutQuint"
                }
            };
        }

        /**
         * Get the north layout options
         *      
         * @private     
         * @method
         */
        function getNorthLayoutOptions() {
            return { // header  
                spacing_open: 0, // cosmetic spacing
                togglerLength_open: 0, // HIDE the toggler button
                togglerLength_closed: -1, // "100%" OR -1 = full width of pane
                resizable: false,
                slidable: false,
                size: 70,
                fxName: "none"
            };
        }

        /**
         * Get the west layout options
         *      
         * @private     
         * @method
         */
        function getWestLayoutOptions() {
            return { // menu selection
                size: 175,
                minSize: 150,
                maxSize: 300,
                resizable: true,
                spacing_open: 5, // cosmetic spacing
                spacing_closed: 21, // wider space when closed
                togglerLength_closed: 21, // make toggler 'square' - 21x21
                togglerAlign_closed: "top", // align to top of resizer
                togglerLength_open: 0, // NONE - using custom togglers INSIDE west-pane
                togglerTip_open: "Close West Pane",
                togglerTip_closed: "Open West Pane",
                resizerTip_open: "Resize West Pane",
                slideTrigger_open: "click", // default
                initClosed: false,
                fxName: "drop",
                fxSpeed_open: "normal",
                fxSpeed_close: "slow",
                fxSettings_open: {
                    easing: "easeOutBounce"
                },
                onclose_end: function() {
                    jQuery(".resizer-west").removeClass('ui-draggable-disabled ui-state-disabled ui-draggable');
                    jQuery(".toggler-west").css({
                        display: 'block'
                    });
                }
            };
        }

        /**
         * Get the east layout options
         *      
         * @private     
         * @method
         */
        function getEastLayoutOptions() {
            return { // menu selection
                size: 175,
                minSize: 150,
                maxSize: 300,
                spacing_open: 5, // cosmetic spacing
                spacing_closed: 0, // wider space when closed
                togglerLength_closed: 0, // make toggler 'square' - 21x21
                togglerAlign_closed: "top", // align to top of resizer
                togglerLength_open: 0, // NONE - using custom togglers INSIDE west-pane
                togglerTip_open: "Close East Pane",
                togglerTip_closed: "Open East Pane",
                resizerTip_open: "Resize East Pane",
                slideTrigger_open: "click", // default
                initClosed: true,
                fxName: "drop",
                fxSpeed_open: "normal",
                fxSpeed_close: "slow",
                fxSettings_open: {
                    easing: "easeOutBounce"
                },
                onclose_end: function() {
                    jQuery(".resizer-east").removeClass('ui-draggable-disabled ui-state-disabled ui-draggable');
                    jQuery(".toggler-east").css({
                        display: 'block'
                    });
                }
            };
        }

        /**
         * Get the center layout options
         *      
         * @private     
         * @method
         */
        function getCenterLayoutOptions() {
            return { // file
                minWidth: 400,
                minHeight: 200,
                onresize_start: function() {
                    //jQuery('#mnu_settings_file').hide();
                },
                onresize_end: function() {
                    if (jQuery('div [id*=gbox_]').length > 0) {
                        jQuery('div [id*=gbox_]').each(function(l_id, l_obj) {
                            var l_arr = jQuery(l_obj).attr('id').split('_');
                            var l_name = '';

                            l_arr.shift();
                            l_name = l_arr.join('_');

                            switch (l_name) {

                                case 'file_Grid':
                                    jQuery('#' + l_name)
                                        .setGridWidth((jQuery('#center_file').width() - 12), true);
                                    break;

                                default:
                                    jQuery('#' + l_name)
                                        .setGridWidth((jQuery('#center_file').width() - 12), true);
                            }
                        });
                    }
                }
            };
        }

        /**
         * Get the south layout options
         *      
         * @private     
         * @method
         */
        function getSouthLayoutOptions() {
            return { // file
            };
        }




        /**
         * Builds the general overlay container
         *     	  
         * @private     
         * @method      showMainOverlay
         * @param       (String)      p_file       file string
         * @param       (Integer)     p_width         file width
         * @param       (integer)     p_height        file height
         * 
         * @return      (Boolean)     true           
         */
        function showMainOverlay(p_file, p_width, p_height) {
            var l_overlayheight = jQuery(window).height();
            var l_overlaywidth = jQuery(window).width();
            var l_msgtop = (l_overlayheight / 2) - (p_height / 2);
            var l_msgleft = (l_overlaywidth / 2) - (p_width / 2);

            if (jQuery('#main_overlay_container').length > 0) {
                hideMainOverlay();
            }

            //<!-- ui-dialog -->
            var l_html = '<div id="main_overlay_container">' +
                '<div class="ui-overlay">' +
                '<div class="ui-widget-overlay" style="width:' + l_overlaywidth + 'px; height:' + l_overlayheight + 'px; z-index:2001;" ></div>' +
                '<div style="z-index:2002; width:' + (p_width + 22) + 'px;height:' + (p_height + 22) + 'px; position: absolute; left:' + l_msgleft + 'px; top:' + l_msgtop + 'px;" class="ui-widget-shadow ui-corner-all"></div>' +
                '</div>' +
                '<div class="ui-widget ui-widget-file ui-corner-all" style="z-index:2003; position: absolute; width:' + p_width + 'px;height:' + p_height + 'px;left:' + l_msgleft + 'px; top:' + l_msgtop + 'px; padding: 10px;">' +
                '<label id="overlay_file" >' + p_file + '</label>' +
                '<div id="overlay_progressbar"></div>' +
                '</div>'
            '</div>';

            jQuery('body').append(l_html);
            jQuery('#overlay_progressbar').progressbar({
                value: 100
            });

            return true;
        }

        /**
         * Builds the general overlay container
         *     	  
         * @private     
         * @method        
         */
        function hideMainOverlay() {
            jQuery('#main_overlay_container').empty().remove();
        }

        /**
         * Creates the Application file
         * 
         * @note
         * This is the time to handle file builds based on the role the user has          	   
         * 
         * @private         	  
         * @method        createApplicationfile
         * @param         (Integer)       p_type      panel type		 
         */
        function createApplicationfile(p_type) {
            switch (p_type) {
                case 0: //north
                    buildNorthPane();
                    break;

                case 4: //center
                    buildCenterPane();
                    break;

                default: //nothing

            }
        }

        /**
         * Validates the given role for the user
         * 
         * @private         	  
         * @method       isUserRoleValid
         * @param         (String)        p_val       role name     
         * @param         (Object)        p_roles     user roles
         * @return        (Boolean)       true/false     
         */
        function isUserRoleValid(p_val, p_roles) {
            if (su) {
                return true;
            }
            var p_bool = false;
            jQuery.each(p_roles, function(id, val) {
                if (val == p_val) {
                    p_bool = true;
                }
            });
            return p_bool;
        }

        /**
         * Add the north pane to the body (header-menu)
         * 
         * @private         	  
         * @method        buildNorthPane    
         */
        function buildNorthPane() {
            var l_html = "<div id=\"north_pane\" class=\"ui-layout-north\">" +
                "</div>";
            jQuery(l_html).appendTo('body');
        }


        /**
         * Add the west pane to the body (west-menu)
         * 
         * @private         	  
         * @method        buildWestPane
         */
        function buildWestPane() {
            var l_html = "<div class=\"ui-layout-west\">" +
                "<div id=\"west_title\" class=\"header ui-widget-header\">Menu</div>" +
                "<div id=\"west_file\" class=\"file\"></div>" +
                "<div id=\"west_footer\" class=\"footer ui-widget-header \"></div>" +
                "</div>";
            jQuery(l_html).appendTo('body');
        }

        /**
         * Add the east pane to the body (east-menu)
         * 
         * @private         	  
         * @method        buildEastPane
         */
        function buildEastPane() {
            var l_html = "<div class=\"ui-layout-east\">" +
                "<div id=\"east_title\" class=\"header ui-widget-header\"></div>" +
                "<div id=\"east_file\" class=\"file\"></div>" +
                "<div id=\"east_footer\" class=\"footer ui-widget-header \"></div>" +
                "</div>";
            jQuery(l_html).appendTo('body');
        }

        /**
         * add the center pane to the body (main file)
         * 
         * @private         	  
         * @method        buildCenterPane         
         */
        function buildCenterPane(p_data) {
            var l_html = "<div class=\"ui-layout-center\">" +
                //"<div id=\"center_title\" class=\"header ui-widget-header\"></div>"+
                "<div id=\"center_file\" class=\"file\"></div>" +
                "</div>";
            jQuery(l_html).appendTo('body');
        }

        /**
         * Add the south pane to the body (footer)
         * 
         * @private         	  
         * @method        buildSouthPane         
         */
        function buildSouthPane(p_data) {
            var l_html = "<div class=\"ui-layout-south\">" +
                "<div id=\"south_title\" class=\"header ui-widget-header\"></div>" +
                "<div id=\"south_file\" class=\"file\"></div>" +
                "</div>";

            jQuery(l_html).appendTo('body');
        }



        /**
         * Creates the grid object 
         *     	  
         * @private     
         * @method     createGrid
         * @param      (Object)      p_container       grid parent container object 
         * @param      (String)      p_name            grid object name      
         * @param      (String)      p_caption         grid display name      
         * @param      (Boolean)     p_pager           pager exist true/false
         * @param      (Object)      p_colums          colum names    
         * @param      (Object)      p_model           data model object
         * @param      (Obeject)     p_roles           user roles object
         *	   
         * @return     (Object)      grid object         
         * 	   
         */
        function createGrid(p_container, p_name, p_caption, p_pager, p_col, p_model, p_roles) {
            var l_html = '<table id="' + p_name + '_Grid"></table>';
            if (p_pager) {
                l_html += '<div id="' + p_name + '_Pager"></div>';
            }
            p_container.append(l_html);
            jQuery("#" + p_name + "_Grid").jqGrid(getGridOptions(p_name, p_caption, p_col, p_model, p_roles));

            return jQuery("#" + p_name + "_Grid");

        }


        /**
         * Gets the Grid Options
         *     	  
         * @private     
         * @method   getGridOptions
         * @param      (String)      p_name            grid object name      
         * @param      (String)      p_caption         grid display name      
         * @param      (Object)      p_columnNames     column names    
         * @param      (Object)      p_columnModel     data model object
         * @param      (Object)      p_roles           user role object
         *     	   
         * @return     (Object)      grid object         
         */
        function getGridOptions(p_name, p_caption, p_columnNames, p_columnModel, p_roles) {
            switch (p_name) {
                case 'file_vcdb':
                    return setupfileGridOptions(p_name, p_caption, p_columnNames, p_columnModel);
                    break;

                case 'file_pcdb':
                    return setupfileGridOptions(p_name, p_caption, p_columnNames, p_columnModel);
                    break;
                case 'file_qdb':
                    return setupfileGridOptions(p_name, p_caption, p_columnNames, p_columnModel);
                    break;
                case 'file_map':
                    return setupfileGridOptions(p_name, p_caption, p_columnNames, p_columnModel);
                    break;
                default:
                    return {};

            }
        }

        /**
         * Setup the DataFiles Grid Options
         *     	  
         * @private     
         * @method   setupDataFilesGridOptions
         * @param      (String)      p_name            grid object name      
         * @param      (String)      p_caption         grid display name      
         * @param      (Object)      p_columnNames     column names    
         * @param      (Object)      p_columnModel     data model object
         * @param      (Object)      p_roles           user role object
         *     	   
         * @return     (Object)      grid object            
         */
        function setupfileGridOptions(p_name, p_caption, p_columnNames, p_columnModel, p_roles) {

            return {
                datatype: "local",
                height: 'auto',
                autowidth: false,
                cellsubmit: 'clientArray',
                colNames: p_columnNames,
                colModel: p_columnModel,
                multiselect: false,
                altRows: false,
                caption: p_caption,
                viewrecords: true,
                sortorder: "desc",
                topPager: false,
                pager: '#' + p_name + '_Pager',
                rowNum: 25,
                rowList: [25, 50, 100],
            };
        }

        /**
         * Highlight the object
         * 
         * @private     
         * @method  
         */
        function autoHighlightText() {
            jQuery(this).select();
        }

        function getComfirmationDialogText() {
            return 'Are you sure?';
        }

        /**
         * Add records to the grid
         *     	  
         * @private     
         * @method        addRecordToGrid
         * @param         (Object)        p_grid      grid object
         * @param         (Object)        p_data      data array object       
         *
         * @return        (Boolean)       true      completed		 
         */
        function addRecordToGrid(p_grid, p_data) {
            var l_data = (p_data.items) ? p_data.items : p_data;
            for (var i = 0; i <= l_data.length; i++) {
                p_grid.jqGrid('addRowData', (i + 1), l_data[i]);
            }
            return true;
        }
        /**
         * create menu container 
         *  
         * @private     
         * @method     createMenuContainer
         * @param     (String)      p_name     grid base name
         * 
         */
        function createMenuContainer(p_name) {
            var l_menu = jQuery('#grid_menu_container_' + p_name);
            if (l_menu.length > 0) {
                return false;
            }
            var l_html = '<div id="grid_menu_container_' + p_name + '" class="action-menu-item"  >' +
                '<ul id="menu_item_container_' + p_name + '" >' +
                '<li><a href="#">Item 1</a></li>' +
                '</ul>'
            '</div>';
            jQuery('#gview_' + p_name + '_Grid').find('.ui-jqgrid-bdiv').after(l_html);
        }


        /**
         * Determines what paging handler to call for the grid 
         *     	  
         * @private     
         * @method   
         * @param    (String)     p_name             data grid name      
         * @param    (String)     p_button           paging item name            
         */
        function pagingRecords(p_name, p_button) {
            var l_arr = p_name.split('_');
            switch (l_arr[0]) {
                default: pagingfileRecords(p_name, p_button);
            }
        }



        /**
         * Handles the partNumber paging 
         *     	  
         * @private     
         * @method    pagingfileRecords
         * @param    (String)     p_name             data grid name      
         * @param    (String)     p_button           paging item name            
         */
        function pagingfileRecords(p_name, p_button) {
            var l_val = jQuery("#" + p_name + "_Pager_center")
                .find('td:last')
                .find('select')
                .val();

            var l_pager_input = jQuery('span[id="sp_1_' + p_name + '_Pager"]').siblings('input');
            if (isNaN(l_pager_input.val())) {
                l_pager_input.val(grid_current_pages[p_name]);
            } else { //number
                if (l_pager_input.val() < 1) { //less than 1
                    l_pager_input.val(grid_current_pages[p_name]);
                } else {
                    if (l_pager_input.val() > (grid_page_totals[p_name] * 1)) { //>max allowed
                        l_pager_input.val(grid_current_pages[p_name]);
                    } else { //valid good
                        //     var l_sort = getPaginationSorts( p_name );
                        if (p_button === "records") {
                            l_pager_input.val(1);
                            grid_intervals[p_name] = l_val;
                        }
                        grid_current_pages[p_name] = l_pager_input.val();

                        showMainOverlay('Fetching Data...', 150, 50)
                        that.notifyFetchfileData({
                            grid_name: p_name,
                            grid_container: jQuery('#file_manager_master')
                        }, {
                            max: l_val,
                            offset: ((l_pager_input.val() - 1) * l_val)
                                //    sort: l_sort.sortcol,
                                //     order: l_sort.sortorder
                        });
                    }
                }
            }
        }


        /**
         * Setup the grid pagingation events
         *      
         * @private     
         * @method       setupGridPagination
         * @param        (String)      p_name    grid name
         * @param        (Integer)     p_total   record total          
         */
        function setupGridPagination(p_name, p_total) {
            var l_int_object = jQuery("#" + p_name + "_Pager_center").find('td:last').find('select');

            var l_page = (grid_current_pages[p_name]) ? grid_current_pages[p_name] : 1;
            var l_interval = grid_intervals[p_name];

            if (grid_intervals[p_name] == undefined) {
                l_interval = l_int_object.val();
                grid_intervals[p_name] = l_interval;
            }

            l_int_object.val(l_interval);
            setupPagingNavigationEvents(p_name);

            grid_current_pages[p_name] = l_page;
            grid_page_totals[p_name] = Math.ceil(p_total / l_interval);

            setupPagingNavigationButtons(p_name, grid_page_totals[p_name], l_page);
            setupPagingDisplayText(p_name, l_page, l_interval, p_total);
        }

        /**
         * Setup the paging text
         *      
         * @private     
         * @method  
         * @param        (String)      p_name        grid name
         * @param        (Integer)     p_page        current page       
         * @param        (Integer)     p_interval    grid data interval (range)
         * @param        (Integer)     p_total       total records
         */
        function setupPagingDisplayText(p_name, p_page, p_interval, p_total) {
            var l_range_low = 0;
            var l_range_high = 0;

            //text display
            l_range_high = (p_total < p_interval) ? p_total : (p_interval * p_page);
            l_range_low = (p_total < p_interval) ? 1 : (l_range_high - p_interval + 1);
            l_range_high = (l_range_high >= p_total) ? p_total : l_range_high;

            //right display     
            jQuery('#' + p_name + '_Pager_right')
                .find('div')
                .html('View ' + l_range_low + ' - ' + l_range_high + ' of ' + p_total);

            //center page text box
            jQuery('#' + p_name + '_Pager_center')
                .find('input[role="textbox"]')
                .val(p_page);

            //center display 
            jQuery('span[id="sp_1_' + p_name + '_Pager"]').html(grid_page_totals[p_name]);
            jQuery('span[id="sp_1_' + p_name + '_Grid_toppager"]').html(grid_page_totals[p_name]);

        }

        /**
         * Setup the grid pagingation navigation buttons
         *      
         * @private     
         * @method       setupPagingNavigationButtons
         * @param        (String)      p_name      grid name
         * @param        (Integer)     p_tpages    total pages
         * @param        (Integer)     p_page      current page               
         */
        function setupPagingNavigationButtons(p_name, p_tpages, p_page) {
            var l_next_obj = jQuery('#' + p_name + '_Pager_center').find('td[id="next_' + p_name + '_Pager"]');
            var l_first_obj = jQuery('#' + p_name + '_Pager_center').find('td[id="first_' + p_name + '_Pager"]');
            var l_last_obj = jQuery('#' + p_name + '_Pager_center').find('td[id="last_' + p_name + '_Pager"]');
            var l_prev_obj = jQuery('#' + p_name + '_Pager_center').find('td[id="prev_' + p_name + '_Pager"]');

            if (p_tpages > 1) {
                if (p_page != p_tpages) {
                    l_next_obj.removeClass('ui-state-disabled');
                    l_last_obj.removeClass('ui-state-disabled');
                }
                if (p_page > 1) {
                    l_prev_obj.removeClass('ui-state-disabled');
                    l_first_obj.removeClass('ui-state-disabled');
                }
            }
        }

        /**
         * Setup the grid pagingation navigation events
         *      
         * @private     
         * @method       setupPagingNavigationEvents
         * @param        (String)      p_name    grid name
         */
        function setupPagingNavigationEvents(p_name) {

            var l_next_obj = jQuery('#' + p_name + '_Pager_center').find('td[id="next_' + p_name + '_Pager"]');
            var l_first_obj = jQuery('#' + p_name + '_Pager_center').find('td[id="first_' + p_name + '_Pager"]');
            var l_last_obj = jQuery('#' + p_name + '_Pager_center').find('td[id="last_' + p_name + '_Pager"]');
            var l_prev_obj = jQuery('#' + p_name + '_Pager_center').find('td[id="prev_' + p_name + '_Pager"]');
            var l_pager_input = jQuery('span[id="sp_1_' + p_name + '_Pager"]').siblings('input');

            l_pager_input
                .unbind('blur')
                .bind('blur', function() {
                    if (grid_current_pages[p_name] != l_pager_input.val()) {
                        pagingRecords(p_name);
                    }
                });

            l_next_obj
                .unbind('click')
                .bind('click', function() {
                    if ((l_pager_input.val() * 1) != (grid_page_totals[p_name] * 1)) {
                        l_pager_input.val((l_pager_input.val() * 1) + 1);
                        pagingRecords(p_name);
                    }
                });

            l_last_obj
                .unbind('click')
                .bind('click', function() {
                    l_pager_input.val(grid_page_totals[p_name]);
                    pagingRecords(p_name);
                });

            l_prev_obj
                .unbind('click')
                .bind('click', function() {
                    if ((l_pager_input.val() * 1) != 1) {
                        l_pager_input.val(((l_pager_input.val() * 1) - 1));
                        pagingRecords(p_name);
                    }
                });

            l_first_obj
                .unbind('click')
                .bind('click', function() {
                    l_pager_input.val(1);
                    pagingRecords(p_name);
                });
        }



        /**
         * Get the grid's column model definitions 
         *     	  
         * @private     
         * @method     getGridModel
         * @param      (Object)     p_name    grid name
         * @return     (Object)     grid model          
         */
        function getGridModel(p_name) {
            switch (p_name) {
                case 'file_vcdb':
                    return getfileVCDBFilesGridModel();
                    break;

                case 'file_pcdb':
                    return getfilePCDBFilesGridModel();
                    break;
                case 'file_qdb':
                    return getfileQDBFilesGridModel();
                    break;
                case 'file_map':
                    return getVehMapGridModel();
                    break;
                default:
                    return [{}];
            }
        }

        /**
         * Get the DataFiles definitions
         *     	  
         * @private     
         * @method   
         * @return     (Object)    grid model     
         */
        function getfileVCDBFilesGridModel() {
            return [{
                    name: 'id',
                    index: 'id',
                    searchable: false,
                    sortable: false,
                    datatype: 'number',
                    width: 100,
                    hidden: true
                }, {
                    name: 'versionDate',
                    index: 'versionDate',
                    searchable: true,
                    datatype: 'date',
                    editable: false,
                    sortable: false,
                    width: 300,
                    sorttype: "date",
                    datefmt: 'mm/dd/yyyy',
                    editrules: {
                        date: true
                    }
                }, {
                    name: 'dateLoaded',
                    index: 'dateLoaded',
                    searchable: true,
                    datatype: 'date',
                    editable: false,
                    sortable: false,
                    width: 300,
                    sorttype: "date",
                    datefmt: 'mm/dd/yyyy',
                    editrules: {
                        date: true
                    }
                }

            ];
        }

        function getfilePCDBFilesGridModel() {
            return [{
                    name: 'id',
                    index: 'id',
                    searchable: false,
                    sortable: false,
                    datatype: 'number',
                    width: 100,
                    hidden: true
                }, {
                    name: 'versionDate',
                    index: 'versionDate',
                    searchable: true,
                    datatype: 'date',
                    editable: false,
                    sortable: false,
                    width: 300,
                    sorttype: "date",
                    datefmt: 'mm/dd/yyyy',
                    editrules: {
                        date: true
                    }
                }, {
                    name: 'dateLoaded',
                    index: 'dateLoaded',
                    searchable: true,
                    datatype: 'date',
                    editable: false,
                    sortable: false,
                    width: 300,
                    sorttype: "date",
                    datefmt: 'mm/dd/yyyy',
                    editrules: {
                        date: true
                    }
                }

            ];
        }

        function getfileQDBFilesGridModel() {
            return [{
                    name: 'id',
                    index: 'id',
                    searchable: false,
                    sortable: false,
                    datatype: 'number',
                    width: 100,
                    hidden: true
                }, {
                    name: 'versionDate',
                    index: 'versionDate',
                    searchable: true,
                    datatype: 'date',
                    editable: false,
                    sortable: false,
                    width: 300,
                    sorttype: "date",
                    datefmt: 'mm/dd/yyyy',
                    editrules: {
                        date: true
                    }
                }, {
                    name: 'dateLoaded',
                    index: 'dateLoaded',
                    searchable: true,
                    datatype: 'date',
                    editable: false,
                    sortable: false,
                    width: 300,
                    sorttype: "date",
                    datefmt: 'mm/dd/yyyy',
                    editrules: {
                        date: true
                    }
                }

            ];
        }

        function getVehMapGridModel() {
            return [{
                    name: 'id',
                    index: 'id',
                    searchable: false,
                    sortable: false,
                    datatype: 'number',
                    width: 100,
                    hidden: true
                }, {
                    name: 'versionDate',
                    index: 'versionDate',
                    searchable: true,
                    datatype: 'date',
                    editable: false,
                    sortable: false,
                    width: 300,
                    sorttype: "date",
                    datefmt: 'mm/dd/yyyy',
                    editrules: {
                        date: true
                    }
                }, {
                    name: 'dateLoaded',
                    index: 'dateLoaded',
                    searchable: true,
                    datatype: 'date',
                    editable: false,
                    sortable: false,
                    width: 300,
                    sorttype: "date",
                    datefmt: 'mm/dd/yyyy',
                    editrules: {
                        date: true
                    }
                }

            ];
        }
        /**
         * Get the grid's column names
         *     	  
         * @private     
         * @method   
         * @param      (Object)      p_name    grid name
         * @return     (Object)      grid labels       
         */
        function getGridNames(p_name) {
            switch (p_name) {
                case 'file_vcdb':
                    return ['ID ', 'VCDB Version', 'Date Loaded'];
                    break;
                case 'file_pcdb':
                    return ['ID ', 'PCDB Version', 'Date Loaded'];
                    break;
                case 'file_qdb':
                    return ['ID ', 'QDB Version', 'Date Loaded'];
                    break;
                case 'file_map':
                    return ['ID ', 'Epicor Vehicle Map Version', 'Date Loaded'];
                    break;
                default:
                    return [];
            }
        }
        /**
         * Capitalize the grid's name
         *     	  
         * @private     
         * @method   
         * @param    (Object)      p_name    grid name
         * @param    (Integer)     p_id      data source id (optional)	   
         */
        function getGridCaption(p_name, p_id) {
            switch (p_name) {
                case 'file_vcdb':
                    return 'VCDB Updates';
                    break;

                case 'file_pcdb':
                    return 'PCDB Updates';
                    break;
                case 'file_qdb':
                    return 'QDB Updates';
                    break;
                case 'file_map':
                    return 'Epicor Vehicle Map Updates';
                    break;
                default:
                    return p_name.substr(0, 1).toUpperCase() + p_name.substr(1);
            }
        }

        /**
         * Builds the action menu HTML
         *     	  
         * @private     
         * @method     buildMenuContainer  
         */
        function buildMenuContainer() {
            var l_html = '<div id="action_container" class="file-action-menu shadow hideme">' +
                '<ul>' +
                '<li class="menu-tile">Paste options</li>' +
                '<li><a href="#"><span><img src="images/paste16.gif" alt="">Paste</span></a></li>' +
                '<li><a href="#"><span>Paste special...</span></a></li>' +
                '<li class="separator"><a href="#"><span><img src="images/link16.gif" alt="">Paste link</span></a></li>' +
                '</ul>' +
                '</div>';

            jQuery('body').append(l_html);
        }




        /**
         * setup the grid for VCDB data this is done after the records have loaded
         *      
         * @private    
         * @method    customGridConfigfile
         * @param       (String)      p_name      grid name
         * @param       (Object)      p_data      data object
         * @param       (Integer)     p_id        data source id
         * @param       (Object)     p_roles     roles object  
         */
        function customGridConfigfile(p_name, p_data, p_id, p_roles) {
            createDataSourcefileButtons(p_roles);
            addfileToolBarEvents(p_name, p_id, p_data);
            setProcessBtnState(p_data);

        }

        /**
         * Gets the Grid Pager Options
         *     	  
         * @private     
         * @method     setupGridPager
         * @param      (String)      p_name        grid name
         * @param      (Object)      p_grid        grid object
         * 	   
         * @return     (Object)      grid object         
         */
        function setupGridPager(p_name, p_grid) {
            return p_grid.navGrid(p_grid.getGridParam('pager'), {
                search: false,
                edit: false,
                add: false,
                del: false,
                view: false,
                refresh: true,
                refreshtext: '',
                refreshtitle: 'Refresh Grid',
                cloneToTop: true,
                beforeRefresh: function() {
                    that.searchfileData(p_name);
                }
            });
        }
        /**
         * Builds the general dialog container
         *     	  
         * @private     
         * @method      buildGeneralDialog
         */
        function buildGeneralDialog() {
            jQuery('body').append("<div id=\"main_dialog\" ></div>");
            jQuery("#main_dialog").dialog({
                autoOpen: false,
                show: 'scale',
                hide: 'scale'
            });
        }
        /**
         * initilize the search for the ACES/PIES data set
         *     	  
         *      
         * @method     searchACESData
         * @param      (String)      p_name        grid name
         * 	   
         */
        this.searchfileData = function(p_name) {
                var l_pager_input = jQuery('span[id="sp_1"]').siblings('input');
                var l_val = jQuery("#" + p_name + "_Pager_center")
                    .find('td:last')
                    .find('select')
                    .val();

                l_pager_input.val(1);
                grid_current_pages[p_name] = l_pager_input.val();
                showMainOverlay('Fetching Content...', 150, 50);
                //fetch the data
                var l_max = grid_intervals[p_name] ? grid_intervals[p_name] : 10;
                that.notifyFetchfileData({
                        grid_name: p_name,
                        grid_container: jQuery('#file_manager_master')

                    }, {
                        max: l_max,
                        offset: 0
                    }
                    //     buildSearchFilterObject( p_name )
                );
            }
            /**
             * setup the grid for VCDB data this is done after the records have loaded
             * 
             * @private    
             * @method       customGridConfigDash 
             * @param       (String)      p_name      grid name
             * @param       (Obejct)      p_data      data object
             * @param       (Object)      p_grid      grid object
             * @param       (Integer)     p_size      grid count
             * 
             */
        function customGridConfigDash(p_name, p_data, p_grid, p_size) {
            jQuery('#' + p_name + '_Pager_center').show();
            setupGridPagination(p_name, p_data.totalCount);



        }




        //----- Public Methods -----//


        /**
         * Creates and load the grid object
         * @note
         *  1)create grid container<br/>
         *  2)create gridpager <br/>
         *  3)create grid with settings <br/>
         *  4)add records     
         *                               
         * @method          loadGrid
         * @param          (Integer)     p_id            data source id          
         * @param          (String)      p_name          grid name
         * @param          (Object)      p_data          grid data    
         * @param          (Object)      p_container     grid container 
         * @param          (Obejct)  	p_roles         user role object 
         */
        this.loadGrid = function(p_id, p_name, p_data, p_container, p_roles) {
            //grid related items
            var l_container = (p_container) ? p_container : jQuery('#center_file');
            var l_size = jQuery('#' + p_name + '_Grid').length;
            var l_grid = (l_size > 0) ?
                jQuery('#' + p_name + '_Grid') :
                createGrid(l_container, p_name, getGridCaption(p_name, p_id), true, getGridNames(p_name), getGridModel(p_name), p_roles);

            if (addRecordToGrid(l_grid.clearGridData(), p_data) == true) {
                switch (p_name) {
                    case 'file_vcdb':
                        customGridConfigDash(p_name, p_data, setupGridPager(p_name, l_grid), l_size);
                        break;

                    case 'file_pcdb':
                        customGridConfigDash(p_name, p_data, setupGridPager(p_name, l_grid), l_size);
                        break;
                    case 'file_qdb':
                        customGridConfigDash(p_name, p_data, setupGridPager(p_name, l_grid), l_size);
                        break;
                    case 'file_map':
                        customGridConfigDash(p_name, p_data, setupGridPager(p_name, l_grid), l_size);
                        break;


                    default:
                        jQuery('#' + p_name + '_Pager_center').hide();
                }
                jQuery('#' + p_name + '_Grid_toppager_center').hide();
                jQuery('#' + p_name + '_Grid_toppager_right').hide();
            }
            // Check to see if the Grid is open in a dialog from the file
            if (jQuery('#main_dialog').dialog('isOpen')) {
                jQuery("#" + p_name + "_Grid").setGridWidth(jQuery(document).width() - 60);
            }
            // end  grid related items
            hideMainOverlay();
            jQuery("#refresh_" + p_name + "_Grid").find('.ui-pg-div span').removeClass('ui-icon').html('<img src="./images/icon/refresh.png"></img>');
            //   jQuery('#file_vcdb_Pager_left').clone(true).insertBefore('#file_vcdb_Grid_toppager_center');
        }




        /**
         * refresh the Datasource
         * 
         * @method     refreshDatasource
         * @param     (Integer)       p_id              datasource token id
         * @param     (Object)        p_roles           user roles      
         */
        this.refreshDatasource = function(p_datasource_id, p_roles) {
            if (jQuery('#file_tab').hasClass('ui-tabs-selected')) {
                var l_tab = 1;
            } else {
                var l_tab = 0;
            }
            jQuery('#tmp_dialog').dialog("destroy").remove();
            selectfilePanel(l_tab, p_roles);
        }


        /**
         * Close the main dialog
         *          
         * @method        
         */
        this.closeDialog = function() {
                jQuery("#main_dialog").dialog('close');
                jQuery("#tmp_dialog").dialog('close');
            }
            /**
             * Set the user flag
             *          
             * @method       setUserType 
             * @param        (Boolean)  p_su    user type flag
             */
        this.setUserType = function(p_su) {
                su = p_su;
            }
            /**
             * Loads JavaScript files on demand.
             *          
             * @method        
             * @param         (String)  p_file filepath and name 
             */
        this.getScript = function(p_file) {
                jQuery.getScript(p_file, function() {
                    that.notifyLoadScriptFinish();
                });
            }
            /**
             * Loads the CSS files on demand.
             * 
             * @method        
             * @param         (String)  p_file filepath and name 
             * @description   
             */
        this.getCss = function(p_file) {
                if (jQuery.browser.msie) { //damn IE, had to be special
                    var fileref = document.createElement("link");
                    fileref.setAttribute("rel", "stylesheet");
                    fileref.setAttribute("type", "text/css");
                    fileref.setAttribute("href", p_file)
                    if (typeof fileref != "undefined") {
                        document.getElementsByTagName("head")[0].appendChild(fileref);
                    }
                } else {
                    jQuery(document.createElement('link')).attr({
                        href: p_file,
                        type: 'text/css',
                        rel: 'stylesheet'
                    }).appendTo('head');
                }
                that.notifyLoadCssFinish();
            }
            /**
             * Sets the general dialog
             *         
             * @method        setDialogMsg
             * @param         (String)    p_title       message title
             * @param         (String)    p_file     message file
             * @param         (String)    p_ext_file extra message file (hidden)    
             * @param         (String)    p_type        message type (0,1,2) info, alert, danger     
             * @param         (Object)    p_options     dialog standard options  
             * @param         (Boolean)   p_bool        flag for using a temp dialog(true) or the main dialog(false or null)           
             */
        this.setDialogMsg = function(p_title, p_file, p_ext_file, p_type, p_options, p_bool) {
            var l_obj = jQuery('#main_dialog');
            if (p_bool) {
                if (jQuery('#tmp_dialog').length === 0) {
                    jQuery('body').append("<div id=\"tmp_dialog\" ></div>");
                    l_obj = jQuery("#tmp_dialog").dialog({
                        autoOpen: false,
                        show: 'scale',
                        hide: 'scale'
                    });
                } else {
                    l_obj = jQuery("#tmp_dialog");
                }
            }

            var l_ext_file = p_ext_file;
            if (l_ext_file.indexOf("419") + 1) {
                l_ext_file = "Your session has timed out, please logout and login again.";
            }
            l_obj.dialog('option', 'title', p_title)
                .dialog('option', p_options)
                .html(standardizeMessage(p_type, p_file, l_ext_file))
                .dialog('open')
                .dialog('moveToTop');

            if (l_ext_file) {
                jQuery('#lnk_details')
                    .toggle(function() {
                        //   l_obj.animate({height: '+='+(p_ext_file.length/20)}, 500);
                        jQuery("#ext_msg_details").slideDown();
                        jQuery(this).text('Close Details');
                    }, function() {
                        jQuery(this).text('More Details');
                        jQuery("#ext_msg_details").slideUp();
                        //    l_obj.animate({height: '-='+(p_ext_file.length/20)}, 500);
                    });
            }
            return l_obj;
        }

        /**
         * Builds the application body file including all the widgets.
         *         
         * @method        hideMainOverlay 
         */
        this.hideMainOverlay = function() {
            hideMainOverlay();
        }

        /**
         * Builds the application body file including all the widgets.
         *         
         * @method        buildBodyHTML 
         */
        this.buildBodyHTML = function() {
                for (var i = 0; i < 5; i++) {
                    createApplicationfile(i);
                }
                if (i == 5) {
                    that.notifyBodyFinish();
                }
            }
            /**
             * Initializes the widgets for the application.  
             *         
             * @method      initializeObjects  
             * @param      (Object)       p_roles           user roles object
             * 		 
             */
        this.initializeObjects = function(p_roles) {
            buildGeneralDialog();
            setupNorthfile(p_roles);
            var mLayout = jQuery("body").layout(getLayoutOptions());

            //file 
            setupCenterfile();

            //system
            setupWindowResizeEvent();
            //  initializeContextMenu();
            /* showMainOverlay('Fetching file...',150,50)
             that.notifyFetchUploadedFilesData( 'upload_files', jQuery('#file_manager_master') ); 
             */

            showMainOverlay('Fetching file...', 150, 50);

            //fetch the data  
            that.notifyFetchfileData({
                grid_name: 'file_vcdb',
                grid_container: jQuery('#file_manager_master')
            }, {
                max: 10,
                offset: 0
            });

            that.notifyViewReady();
        }


        /**
         * Remove external script via AJAX 
         *          
         * @method        removeScript
         * @param         (String)  p_file filepath and name 
         */
        this.removeScript = function(p_file) {
            jQuery('script[src="' + p_file + '"]').remove();
            that.notifyScriptRemoveFinish();
        }

        /**
         * Remove a CSS file
         * 
         * @method        removeCss
         * @param         (String)  p_file filepath and name 	 	 
         */
        this.removeCss = function(p_file) {
            jQuery('link[href="' + p_file + '"]').remove()
            that.notifyCssRemoveFinish();
        }

        /**
         * Adds listeners to itself(View).
         *      
         * @method  
         * @param (Object) p_list A list of overriden event handling methods        
         */
        this.addListener = function(list) {
            listeners.push(list);
        }

        /**
         * Creates a list of event handling methods for the View object.   
         *       
         * @method        
         * @param  (Object) p_list A list of overriden event handling methods 
         * @return (Object) returns the overriden event handling methods
         */
        this.createListener = function(list) {
            if (!list) list = {};
            return jQuery.extend({
                loadCssBegin: function() {},
                loadCssFinish: function() {},
                loadCssRemoveFinish: function() {},
                loadScriptBegin: function() {},
                loadScriptFinish: function() {},
                loadScriptRemoveFinish: function() {},
                loadBodyBegin: function() {},
                loadBodyFinish: function() {},
                initializeObjects: function() {},
                viewReady: function() {},
                fetchDatasourceTokenId: function() {},
                fetchfile: function() {},
            }, list);
        }

        /**
         * Clean up the object a bit.   
         *       
         * @method        
         */
        this.cleanSelf = function() {
            that = null;
            listeners = null;
            su = null;
        }


        //----- Events -----//


        /**
         * @event   notifyFetchTokenAppid 
         *  
         * Fires when the user request a datasource id
         * @param     (Integer)     p_file_id          file_id id     
         */
        this.notifyFetchTokenAppid = function(p_file_id) {
                jQuery.each(listeners, function(i) {
                    listeners[i].fetchTokenAppid(p_file_id);
                });
            }
            /**
             * @event   notifyFetchfileData 
             *  
             * Fires when the user request file data
             *      
             * @param     (Object)      p_data_info         data info object (grid name, container, etc)
             * @param     (Object)      p_pagination_info   pagination info object
             * @param     (Object)      p_search_info       search filter info object	  
             *                  
             */
        this.notifyFetchfileData = function(p_data_info, p_pagination_info, p_search_info) {
                jQuery.each(listeners, function(i) {
                    listeners[i].fetchfileData(p_data_info, p_pagination_info, p_search_info);
                });
            }
            /**
             * @event   notifyFetchDatasourceTokenId 
             *  
             * Fires when the user request a datasource id
             * @param     (String)      p_title             msg box title   
             *           
             */
        this.notifyFetchDatasourceTokenId = function(p_title, p_caller) {
                jQuery.each(listeners, function(i) {
                    listeners[i].fetchDatasourceTokenId(p_title, p_caller);
                });
            }
            /**
             * @event         notifyLoadCssBegin
             * 
             * Fires when the CSS load is starting.          
             * @param         (Array) p_files script list	 
             */
        this.notifyLoadCssBegin = function(p_files) {
                jQuery.each(listeners, function(i) {
                    listeners[i].loadCssBegin(p_files);
                });
            }
            /**
             * @event         notifyLoadCssFinish
             * 
             * Fires when the CSS load has completed.           
             */
        this.notifyLoadCssFinish = function() {
                jQuery.each(listeners, function(i) {
                    listeners[i].loadCssFinish();
                });
            }
            /**
             * @event         notifyCssRemoveFinish
             * 
             * Fires when the CSS removal has completed.               
             */
        this.notifyCssRemoveFinish = function() {
                jQuery.each(listeners, function(i) {
                    listeners[i].loadCssRemoveFinish();
                });
            }
            /**
             * @event        notifyLoadScriptBegin 
             * 
             * Fires when the JavaScript load is starting.              
             * @param         (Array) p_files script list	 
             */
        this.notifyLoadScriptBegin = function(p_files) {
                jQuery.each(listeners, function(i) {
                    listeners[i].loadScriptBegin(p_files);
                });
            }
            /**
             * @event         notifyLoadScriptFinish
             * 
             * Fires when the JavaScript load has completed.            
             */
        this.notifyLoadScriptFinish = function() {
                jQuery.each(listeners, function(i) {
                    listeners[i].loadScriptFinish();
                });
            }
            /**
             * @event         notifyScriptRemoveFinish
             * 
             * Fires when the JavaScript removal has completed.    
             */
        this.notifyScriptRemoveFinish = function() {
                jQuery.each(listeners, function(i) {
                    listeners[i].loadScriptRemoveFinish();
                });
            }
            /**
             * @event         notifyBodyBegin
             * 
             * Fires when the application file load is starting.                        
             */
        this.notifyBodyBegin = function() {
                jQuery.each(listeners, function(i) {
                    listeners[i].loadBodyBegin();
                });
            }
            /**
             * @event         notifyBodyFinish
             *      
             * Fires when the application file load has completed. 
             */
        this.notifyBodyFinish = function() {
                jQuery.each(listeners, function(i) {
                    listeners[i].loadBodyFinish();
                });
            }
            /**
             * @event         notifyInitializeObjects
             *     
             * Fires when the application object initialization is starting.      
             */
        this.notifyInitializeObjects = function() {
            jQuery.each(listeners, function(i) {
                listeners[i].initializeObjects();
            });
        }

        /**
         * @event         notifyViewReady 
         *
         * Fires when the application object initialization has completed.        
         */
        this.notifyViewReady = function() {
            jQuery.each(listeners, function(i) {
                listeners[i].viewReady();
            });

        }
    }
});