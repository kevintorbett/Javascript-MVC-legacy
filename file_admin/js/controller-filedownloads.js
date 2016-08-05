jQuery.extend({
    /**
     * @class      filedownloads.Model
     * @namespace  filedownloads   
     * @extend     jQuery   
     * @description 
     * The Model handles the fetching and manipulation of all data  
     * for the application.
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
     * new jQuery.Model()    
     */

    Model: function() {
        /**
         * @private           
         * @cfg   (String)    base_url 
         * The base service URL  
         */

        /**
         * @private           
         * @property  listeners 
         * @type    (Object) 
         *
         * A config object containing one or more event handlers to be added to this
         * object.  
         */

        /**
         * @private     
         * @property  that
         * @type    (Object)      
         * 
         * Self reference  
         */

        /**
         * @private     
         * @property  token
         * @type    (String)    
         * 
         * Local copy of the user token
         */

        /**
         * @private     
         * @property  app_id
         * @type    (Integer)    
         * 
         * Local copy of the application id
         */

        /**
         * @private     
         * @property  app_roles
         * @type    (Array)        
         * 
         * List of role for the application
         */

        /**
         * @private     
         * @property  app_settings
         * @type    (Object)        
         * 
         * Collection of application settings
         */

        /**
         * @private     
         * @property  demo
         * @type    (Boolean)   use to toggle or demo (debug) mode        
         * 
         * List of Messages (local, main, or both)
         */
        var base_url = location.protocol + '//' + location.host;
        var listeners = [];
        var that = this;

        var token = null;
        var mail = null;
        var app_id = null;
        var app_roles = [];
        var app_settings = {};

        var demo = false;

        //----- Private Methods -----//
        /**
         * Sets the app_roles for the user, 
         * then notify the controller that the validation 
         * process is done.      
         * 
         * @method       
         * @private                         
         * @param   (Object)    p_obj     applications object
         * @param   (Object)    p_user    user type object     
         */
        function setApplicationRoles(p_obj, p_user) {
            jQuery.each(p_obj, function(id, val) {
                app_roles[id] = val;
            });
            that.notifyValidateApplicationFinish(p_user);
        }

        /**    
         * Gets the application setting id given an app id and key
         * 
         * @private     
         * @method      
         * @param       (Integer)     p_app_id     application id
         * @param       (String)      p_key       setting key
         * @param       (Object)      p_obj       data object to search           
         * 
         * @return      (Integer)     setting id 
         */
        function getSettingId(p_app_id, p_key, p_obj) {
            for (var l_id in p_obj) {
                var l_obj = p_obj[l_id];
                if (p_app_id == l_obj.application.id) {
                    if (l_obj.key.toLowerCase() == p_key.toLowerCase()) {
                        l_rval = l_obj.id;
                        l_obj = null;
                        return l_rval;
                    }
                }
                l_obj = null;
                return l_rval;
            }
        }
        /**
         * parse the file data into a grid object
         *         
         * @private     
         * @method      
         * @param       (Object)     p_data     file data object
         *
         * @return      (Object)      grid object     
         */
        function parsefileTofileGrid(p_data) {
            var l_data = [];
            //  var l_overlaps = {};
            var l_obj = null;
            var UTIL = new jQuery.Util();
            jQuery.each(p_data.items, function(p_idx, p_obj) {
                l_obj = p_obj;
                l_obj["versionDate"] = parseDate(p_obj.versionDate).substr(0, 10);
                var l_date = UTIL.toLocalDate(p_obj.dateLoaded);
                var l_time = UTIL.toLocalTime(p_obj.dateLoaded);
                l_obj["dateLoaded"] = l_date + ' ' + l_time;
                l_obj["id"] = p_obj.id;
                l_data.push(l_obj);
                l_obj = null;
            });

            return {
                items: l_data,
                totalCount: p_data.totalCount
            };
        }


        /**
         * parse the date
         *         
         * @private
         * @method  
         * @param     (string)      p_date        date string
         *          
         * @return    (string)      p_date        date string  
         */
        function parseDate(p_date) {
            var l_arr = p_date.split('T');
            var l_date = l_arr[0];
            var l_time = l_arr[1];
            var l_arr2 = l_date.split('-');
            var l_yyyy = l_arr2[0];
            var l_mm = l_arr2[1];
            var l_dd = l_arr2[2];
            var l_len = l_time.length - 1;
            l_time2 = l_time.substring(0, l_len);
            var l_arr3 = l_time2.split(':');
            var l_hh = l_arr3[0];
            var l_mi = l_arr3[1];
            var l_ss = l_arr3[2];
            if (l_hh > 12) {
                var l_ampm = 'pm'
                l_hh = l_hh - 12;
            } else {
                var l_ampm = 'am'
            }
            l_time = l_mm + '/' + l_dd + '/' + l_yyyy + ' ' + l_hh + ':' + l_mi + l_ampm;
            return l_time;
        }

        /**
         * Process the file data based on the grid (type) name
         *  
         * @private
         * @method    processFetchedfileData
         * @param			(String)			p_name
         * @param			(Object)			p_data
         * @param			(Object)			p_container
         * @param			(Integer)			p_data_source_id
         *
         */
        function processFetchedfileData(p_name, p_data, p_container, p_data_source_id) {
            that.notifyFetchfileDataFinish('', parsefileTofileGrid(p_data), p_name, p_container);

        }




        //----- Public Methods -----//

        /**
    /**
     * Process the content data based on the grid (type) name
     *  
     * @private
     * @method    processFetchedContentData
     * @param			(String)			p_name
     * @param			(Object)			p_data
     * @param			(Object)			p_container
     * @param			(Integer)			p_data_source_id
     *
     */
        this.fetchfileInformation = function(p_data_info, p_pagination_info, p_search_info) {
            l_url2 = '';
            switch (p_data_info.grid_name) {
                case 'file_pcdb':
                    l_url2 = 'pcdbVersion';
                    break;

                case 'file_vcdb':
                    l_url2 = 'vcdbVersion';
                    break;
                case 'file_qdb':
                    l_url2 = 'qdbVersion';
                    break;
                case 'file_map':
                    l_url2 = 'vehMapVersion';
                    break;
                default:

            }
            jQuery.ajax({
                type: "GET",
                url: base_url + '/xxx/catalog/' + l_url2,
                cache: false,
                beforeSend: function(p_req) {
                    p_req.setRequestHeader('Authorization', token);
                    p_req.setRequestHeader('Authorization-Application', app_id);
                },
                fileType: "text/json",
                dataType: "json",
                data: {
                    offset: p_pagination_info.offset,
                    sort: 'versionDate',
                    order: 'desc'
                },
                success: function(p_data) {
                    processFetchedfileData(p_data_info.grid_name, p_data, p_data_info.grid_container, null);
                },
                error: function(p_xhr, p_msg, p_err) {
                    that.notifyErrorMessageDialog('Error', 'There was an error fetching the file information.', p_xhr, p_err);
                }
            });
        }

        /**    
         * Sets the base_url string
         * 
         * @method    setBaseUrl
         * @param   (String)    p_val   value for base URL              
         */
        this.setBaseURL = function(p_val) {
            base_url = p_val;
        }

        /**    
         * Return the base_url string
         * 
         * @method    getBasesUrl
         * @return    (String)    value of base URL              
         */
        this.getBaseURL = function() {
            return base_url;
        }

        /**
         * Returns the token
         *        
         * @method     getAuthorizationToken 
         * 
         * @return      (String)      token		 
         *          	 
         */
        this.getAuthorizationToken = function() {
            return token;
        }

        /**
         * Returns the application id
         *        
         * @method      getApplicationId
         * 
         * @return      (Integer)      application id
         *          	 
         */
        this.getApplicationId = function() {
            return app_id;
        }

        /**
         * Returns the application id
         *        
         * @method      getApplicationId
         * 
         * @return      (Integer)      application id
         *          	 
         */
        this.getApplicationId = function() {
            return app_id;
        }


        /**
         * Fetches the initial datasource id 
         *        
         * @method    fetchDatasourceTokenId                   
         * @param     (String)      p_title             msg box title 
         * 		 
         * @return    (Object)    datasource id object      
         *              	 
         */
        this.fetchDatasourceTokenId = function(p_title, p_caller) {
            jQuery.ajax({
                type: "POST",
                url: base_url + '/xxx/batch/itemDataSource',
                cache: false,
                beforeSend: function(p_req) {
                    p_req.setRequestHeader('Authorization', token);
                    p_req.setRequestHeader('Authorization-Application', app_id);
                },
                fileType: "text/json",
                dataType: "json",
                data: {
                    "description": ""
                },
                success: function(p_data) {
                    that.notifyFetchDatasourceTokenIdFinish(p_data[0], p_title, p_caller);
                }
            });
        }

        /**
         * Validates the application by calling the parent(Main Portal Application),
         * <br>success: call setApplicationRoles
         * <br>error: notify controller      
         *     
         * @method    validateApplication 
         */
        this.validateApplication = function() {
                if (demo) {
                    token = '2111-FT0kwq4MbyAUss2z';
                    app_id = '2';
                    app_roles = ["LOCAL_READ", "LOCAL_UPDATE"];
                    that.notifyValidateApplicationFinish(true);
                } else {
                    try {
                        var l_app_object = (window.opener) ?
                            window.opener.controller.validateApplication(location) :
                            window.parent.controller.validateApplication(location);
                    } catch (l_err) {
                        l_app_object = null;
                        that.notifyValidateApplicationFailed();
                    } finally {
                        if (l_app_object) {
                            token = l_app_object[0].token;
                            app_id = l_app_object[0].id;
                            mail = l_app_object[0].mail;
                            app_settings = l_app_object[0].settings;
                            if (l_app_object[0].superUser) {
                                setApplicationRoles(l_app_object[1], l_app_object[0].superUser);
                            } else {
                                if (l_app_object[1].length > 0) {
                                    setApplicationRoles(l_app_object[1], l_app_object[0].superUser);
                                } else {
                                    l_app_object = null;
                                    that.notifyValidateApplicationFailed(2);
                                }
                            }
                            l_app_object = null;
                        } else {
                            l_app_object = null;
                            that.notifyValidateApplicationFailed(1);
                        }
                    }
                }
            }
            /**
             * Sets the local application setting version given key/value pair
             * 
             * @method
             * @param   (Integer)   p_key      application setting key   
             * @param   (Integer)   p_val      application setting val
             */
        this.setApplicationSettingValue = function(p_key, p_val) {
            for (var l_item in app_settings) {
                if (app_settings[l_item].key.toLowerCase() == p_key.toLowerCase()) {
                    app_settings[l_item].value = p_val;
                    break;
                }
            }
        }

        /**
         * Add a listener to the Model.
         *      
         * @method    addListener     
         * @param   (Object)    p_list    A list of overriden event handling methods
         */
        this.addListener = function(p_list) {
            listeners.push(p_list);
        }

        /**
         * Creates a stubbed list of event handling methods for the Model object.
         *         
         * @method   createListener         
         * @param    (Object)    p_list    A list of overriden event handling methods 
         *     
         * @return   (Object)    returns the overriden event handling methods
         */
        this.createListener = function(list) {
            if (!list) {
                list = {};
            }

            return jQuery.extend({
                validateApplicationFinish: function() {},
                validateApplicationFailed: function() {},
                sendAlert: function() {},
                fetchUploadedFilesDataFinish: function() {},
                fetchDatasourceTokenIdFinish: function() {},
                uploadDefaultMetaDataFinish: function() {},
                fetchDefaultMetaDataFinish: function() {},
                fetchAppendMetaDataFinish: function() {},
                fetchDatasourceTokenIdFinish: function() {},
                fetchfileDataFinish: function() {},
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
            app_roles = null;
            app_settings = null;

            base_url = null;
            token = null;
            app_id = null;
            demo = null;
        }

        //----- Events -----//   
        /**
         * @event     notifyFetchfileInformationFinish 
         * 
         * Fires when file information fetch has completed 
         * 		 
         * @param       (Object)      p_data              file info object
         * @param       (Integer)     p_file_id        file id		 
         * @param       (String)      p_type              "pcdb" or "vcdb"  
         * @param       (String)      p_count             iteration count used to toggle service calls
         */
        this.notifyFetchfileInformationFinish = function(p_data, p_file_id, p_type, p_count) {
            jQuery.each(listeners, function(i) {
                listeners[i].fetchfileInformationFinish(p_data, p_file_id, p_type, p_count);
            })
        }

        this.notifyFetchfileFailed = function(p_id, p_data, p_returnCode) {
                jQuery.each(listeners, function(i) {
                    listeners[i].fetchfileFailed(p_id, p_data, p_returnCode);
                });
            }
            /**
             * @event   notifyValidateApplicationFailed
             *       
             * Fires after the application validation has failed.   
             * @param       (Integer)     p_type      error types
             * 
             * @note           
             * <br> 1 for authentication error     
             * <br> 2 for no roles error
             * <br> else access error           
             */
        this.notifyValidateApplicationFailed = function(p_type) {
            jQuery.each(listeners, function(i) {
                listeners[i].validateApplicationFailed(p_type);
            });
        }

        /**
         * @event   notifyFetchfileDataFinish
         *       
         * Fires after the application fetches the uploaded dataset has completed.   
         * @param     (Object)       p_datafiles        file data object
         * @param     (String)       p_name             grid name
         * @param     (Object)       p_container        grid container object  		 
         * 
         */
        this.notifyFetchfileDataFinish = function(p_data_id, p_datafiles, p_name, p_container) {
            jQuery.each(listeners, function(i) {
                listeners[i].fetchfileDataFinish(p_data_id, p_datafiles, p_name, p_container);
            });
        }

        /**
         * 
         * @event     notifyErrorMessageDialog
         *
         * Fires when an error is returned from a request.
         * @param     (String)     p_title          Message Dialog Title  
         * @param     (String)     p_msg            Message  
         * @param     (Object)     p_xhr            XMLHttpRequest object    
         * @param     (Object)     p_err     	      error exception if avail
         */
        this.notifyErrorMessageDialog = function(p_title, p_msg, p_xhr, p_err) {
                jQuery.each(listeners, function(i) {
                    listeners[i].dislayErrorMessageDialog(p_title, p_msg, p_xhr, p_err);
                });
            }
            /**
             * @event     notifyValidateApplicationFinish
             * 
             * Fires after the application validation has completed     
             * @param   (Boolean)    p_user    user object            		 
             */
        this.notifyValidateApplicationFinish = function(p_user) {
                jQuery.each(listeners, function(i) {
                    listeners[i].validateApplicationFinish(p_user);
                });
            }
            /**
             * Returns the app_roles for the user
             * 
             * @method    getRoles                     
             * @return    (Array)    user roles array
             */
        this.getRoles = function() {
            return app_roles;
        }

        /**
         * 
         * @event     notifySendAlert
         *
         * Fires when an alert is being sent out.
         * @param       (String)  p_title    message title
         * @param       (String)  p_file  message file	 
         * @param       (Integer) p_type     message type {0='norm',1='alert',2='important'}       
         * @param       (Integer) p_duration message duration
         * @param       (Boolean) p_sticky   message posting type (sticky)       
         */
        this.notifySendAlert = function(p_title, p_file, p_type, p_duration, p_sticky) {
            jQuery.each(listeners, function(i) {
                listeners[i].sendAlert(p_title, p_file, p_type, p_duration, p_sticky);
            });
        }


    }
});