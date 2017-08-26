/** Workflow view */
define( [ 'utils/utils', 'mvc/ui/ui-misc', "mvc/tag", "mvc/workflow/workflow-model"  ], function( Utils, Ui, TAGS, WORKFLOWS ) {

    /** Build messages after user action */
    function build_messages() {
        var $el_message = this.$( '.response-message' ),
            response = {};
        response = {
            'status': Utils.getQueryString( 'status' ),
            'message': _.escape( Utils.getQueryString( 'message' ) ),
            'persistent': true,
            'cls': Utils.getQueryString( 'status' ) + 'message'
        };
        $el_message.empty().html( new Ui.Message( response ).$el );
    }


    /** View of the individual workflows */

    var WorkflowItemView = Backbone.View.extend({
        tagName: 'tr', // name of (orphan) root tag in this.el
        initialize: function(){
            _.bindAll(this, 'render', 'render_row', 'render_tag_editor', '_templateActions', 'model_remove'); // every function that uses 'this' as the current object should be in here
            // console.log(this);
        },

        events: {
            'click #show-in-tool-panel': 'show_in_tool_panel',
            'click #delete-workflow' : 'model_remove',
            'click #rename-workflow' : 'rename_workflow'
        },

        render: function(){
            $(this.el).html(this.render_row());
            return this; // for chainable calls, like .render().el
        },

        show_in_tool_panel: function(){
            this.model.set('show_in_tool_panel', !this.model.get('show_in_tool_panel'));
            this.model.save();
        },

        model_remove: function(){
            // console.log(this.model);
            if (confirm( "Are you sure you want to delete workflow '" + this.model.get('name') + "'?" )) {
                this.model.destroy();
                this.remove();
            };
        },

        rename_workflow: function(){
            var newname = prompt("Enter a new Name for workflow '" + this.model.get('name') + "'", this.model.get('name') );
            if (newname) {
                this.model.set('name', newname);
                this.model.save();
                this.render();
            }
        },

        render_row: function() {
            var show_in_tool_panel = this.model.get("show_in_tool_panel");
            var wf_id = this.model.id;
            var checkbox_html = '<input id="show-in-tool-panel" type="checkbox" class="show-in-tool-panel" '+ ( show_in_tool_panel ? 'checked="' + show_in_tool_panel + '"' : "" ) +' value="' + wf_id + '">';
            var trHtml =  '<td>' +
                             '<div class="dropdown">' +
                                 '<button class="menubutton" type="button" data-toggle="dropdown">' +
                                     _.escape( this.model.get("name") ) + '<span class="caret"></span>' +
                                 '</button>' +
                                 this._templateActions( ) +
                             '</div>' +
                          '</td>' +
                          '<td><span>' + '<div class="' + wf_id + ' tags-display"></div>' + '</td>' +
                          '<td>' + ( this.model.get('owner') === Galaxy.user.attributes.username ? "You" : this.model.get('owner') ) +'</span></td>' +
                          '<td>' + this.model.get("number_of_steps") + '</td>' +
                          '<td>' + ( this.model.get("published") ? "Yes" : "No" ) + '</td>' +
                          '<td>'+ checkbox_html + '</td>';
            return trHtml;
        },

        render_tag_editor: function(){
            tag_editor = new TAGS.WorkflowTagsEditor({
            model           : this.model,
            el              : $.find( '.' + this.model.id + '.tags-display' )});

            tag_editor.toggle( true );
            tag_editor.render();
        },

        /** Template for user actions for workflows */
        _templateActions: function( ) {
            if( this.model.get("owner") === Galaxy.user.attributes.username ) {
                return '<ul class="dropdown-menu action-dpd">' +
                           '<li><a href="'+ Galaxy.root +'workflow/editor?id='+ this.model.id +'">Edit</a></li>' +
                           '<li><a href="'+ Galaxy.root +'workflow/run?id='+ this.model.id +'">Run</a></li>' +
                           '<li><a href="'+ Galaxy.root +'workflow/sharing?id='+ this.model.id +'">Share</a></li>' +
                           '<li><a href="'+ Galaxy.root +'api/workflows/'+ this.model.id +'/download">Download</a></li>' +
                           '<li><a href="'+ Galaxy.root +'workflow/copy?id='+ this.model.id +'">Copy</a></li>' +
                           '<li><a id="rename-workflow" style="cursor: pointer;">Rename</a></li>' +
                           '<li><a href="'+ Galaxy.root +'workflow/display_by_id?id='+ this.model.id +'">View</a></li>' +
                           '<li><a id="delete-workflow" style="cursor: pointer;">Delete</a></li>' +
                      '</ul>';
            }
            else {
                return '<ul class="dropdown-menu action-dpd">' +
                         '<li><a href="'+ Galaxy.root +'workflow/display_by_username_and_slug?username='+ workflow.owner +'&slug='+ workflow.slug +'">View</a></li>' +
                         '<li><a href="'+ Galaxy.root +'workflow/run?id='+ this.model.id +'">Run</a></li>' +
                         '<li><a href="'+ Galaxy.root +'workflow/copy?id='+ this.model.id +'">Copy</a></li>' +
                         '<li><a class="link-confirm-shared-'+ this.model.id +'" href="'+ Galaxy.root +'workflow/sharing?unshare_me=True&id='+ this.model.id +'">Remove</a></li>' +
                      '</ul>';
            }
        },


    });

    /** View of the main workflow list page */
    var WorkflowListView = Backbone.View.extend({

        initialize: function() {
            this.setElement( '<div/>' );
            this.collection = new WORKFLOWS.WorkflowCollection();
            // this.collection.comparator = 'number_of_steps';
            // this.collection.on('sort', this.render, this);
            _.bindAll(this, 'prependItem');
            this.collection.bind('add', this.appendItem); // collection event binder
            this.collection.on('sync', this.render, this);  // hack to call
            //this.render();
        },

        events: {
            'dragenter' : 'highlightDropZone',
            'dragleave' : 'unhighlightDropZone',
            'drop' : 'drop',
            'dragover': function(ev) {
                ev.preventDefault();
            }
        },

        highlightDropZone: function() {
            console.log('Dropzone')
        },

        unhighlightDropZone: function() {
            console.log('Unhighlight Dropzone')
        },

        dropTest: function() {
            console.log('Droptest')
        },

        drop: function(e) {
            e.preventDefault();
            console.log(e);
            var files = e.dataTransfer.files;
            var self = this;
            for (var i = 0, f; f = files[i]; i++) {
                var reader = new FileReader();
                reader.onload = function(theFile) {
                    var wf_json = JSON.parse(reader.result);
                    self.collection.create(wf_json, { at: 0, wait: true});
                    console.log(self.collection);
                    // self.collection.sort();
                    // self.render();
                };
                reader.readAsText(f);
            }
        },

        render: function() {
            var self = this,
                min_query_length = 3;
                var $el_workflow;
                // Add workflow header
                var header = self._templateHeader();
                build_messages();
                $el_workflow = self.$( '.user-workflows' );
                // console.log($el_workflow);
                // Add the actions buttons
                var template_actions = self._templateActionButtons();
                var workflows = this.collection;
                // _.each(workflows, function(workflow) {
                //     this.$( '.user-workflows' ).find('tbody').append(workflowItemView.render().el);
                // });
                console.log('The workflows');
                // console.log(workflows);

                var table_template = self._templateWorkflowTable();
                this.$el.html( header + template_actions + table_template);

                console.log(table_template);
                _(this.collection.models).each(function(item){ // in case collection is not empty
                    self.appendItem(item, prepend=false);
                }, this);
                self.adjust_actiondropdown( this.$el );
                // Register delete and run workflow events
                // _.each( workflows, function( wf ) {
                //    self.confirm_delete( wf );
                //});
                self.register_show_tool_menu();
                // Register search workflow event
                self.search_workflow( self.$( '.search-wf' ), self.$( '.workflow-search tr' ), min_query_length );
                return this;
        },

        prependItem: function(item){
            this.appendItem(item, true);
        },

        appendItem: function(item, prepend){
            var workflowItemView = new WorkflowItemView({
                model: item,
                collection: this,
            });
            if (prepend === true){
                console.log('prepending');
                self.$( '.workflow-search' ).prepend(workflowItemView.render().el);
            } else {
                console.log('appending');
                self.$( '.workflow-search' ).append(workflowItemView.render().el);
            }
            workflowItemView.render_tag_editor();
        },

        // Save the workflow as an item in Tool panel
        register_show_tool_menu: function() {
            var $el_checkboxes = this.$( '.show-in-tool-panel' );
            $el_checkboxes.on( 'click', function( e ) {
                window.location = Galaxy.root + 'workflow';
            });
        },

        /** Add confirm box before removing/unsharing workflow */
        confirm_delete: function( workflow ) {
            var $el_wf_link = this.$( '.link-confirm-' + workflow.id ),
                $el_shared_wf_link = this.$( '.link-confirm-shared-' + workflow.id );
            $el_wf_link.click( function() {
                return confirm( "Are you sure you want to delete workflow '" + workflow.name + "'?" );
            });
            $el_shared_wf_link.click( function() {
                return confirm( "Are you sure you want to remove the shared workflow '" + workflow.name + "'?" );
            });
        },

        /** Implement client side workflow search/filtering */
        search_workflow: function( $el_searchinput, $el_tabletr, min_querylen ) {
            $el_searchinput.on( 'keyup', function () {
                console.log(this);
                console.log($el_tabletr);
                var query = $( this ).val();
                // Filter when query is at least 3 characters
                // otherwise show all rows
                if( query.length >= min_querylen ) {
                    // Ignore the query's case using 'i'
                    var regular_expression = new RegExp( query, 'i' );
                    $el_tabletr.hide();
                    $el_tabletr.filter(function () {
                        // Apply regular expression on each row's text
                        // and show when there is a match
                        return regular_expression.test( $( this ).text() );
                    }).show();
                }
                else {
                    $el_tabletr.show();
                }
            });
        },

        /** Ajust the position of dropdown with respect to table */
        adjust_actiondropdown: function( $el ) {
            $el.on( 'show.bs.dropdown', function () {
                $el.css( "overflow", "inherit" );
            });

            $el.on( 'hide.bs.dropdown', function () {
                $el.css( "overflow", "auto" );
            });
        },

        /** Template for no workflow */
        _templateNoWorkflow: function() {
            return '<div class="wf-nodata"> You have no workflows. </div>';
        },

        /** Template for actions buttons */
        _templateActionButtons: function() {
           return '<ul class="manage-table-actions">' +
                '<li>' +
                    '<input class="search-wf form-control" type="text" autocomplete="off" placeholder="search for workflow...">' +
                '</li>' +
                '<li>' +
                    '<a class="action-button fa fa-plus wf-action" id="new-workflow" title="Create new workflow" href="'+ Galaxy.root +'workflow/create">' +
                    '</a>' +
                '</li>' +
                '<li>' +
                    '<a class="action-button fa fa-upload wf-action" id="import-workflow" title="Upload or import workflow" href="'+ Galaxy.root +'workflow/import_workflow">' +
                    '</a>' +
                '</li>' +
            '</ul>';
        },

        /** Template for workflow table */
        _templateWorkflowTable: function( self ) {
            var tableHtml = '<table class="table colored"><thead>' +
                    '<tr class="header">' +
                        '<th>Name</th>' +
                        '<th>Tags</th>' +
                        '<th>Owner</th>' +
                        '<th># of Steps</th>' +
                        '<th>Published</th>' +
                        '<th>Show in tools panel</th>' +
                    '</tr></thead>';
            return tableHtml + '<tbody class="workflow-search">' + '</tbody></table>';
        },



        /** Main template */
        _templateHeader: function() {
            return '<div class="page-container">' +
                       '<div class="user-workflows wf">' +
                           '<div class="response-message"></div>' +
                           '<h2>Your workflows</h2>' +
                       '</div>'+
                   '</div>';
        }
    });

    var ImportWorkflowView = Backbone.View.extend({

        initialize: function() {
            this.setElement( '<div/>' );
            this.render();
        },

        /** Open page to import workflow */
        render: function() {
            var self = this;
            $.getJSON( Galaxy.root + 'workflow/upload_import_workflow', function( options ) {
                self.$el.empty().append( self._mainTemplate( options ) );
            });
        },

        /** Template for the import workflow page */
        _mainTemplate: function( options ) {
            return "<div class='toolForm'>" +
                       "<div class='toolFormTitle'>Import Galaxy workflow</div>" +
                        "<div class='toolFormBody'>" +
                            "<form name='import_workflow' id='import_workflow' action='"+ Galaxy.root + 'workflow/upload_import_workflow' +"' enctype='multipart/form-data' method='POST'>" +
                            "<div class='form-row'>" +
                                "<label>Galaxy workflow URL:</label>" + 
                                "<input type='text' name='url' class='input-url' value='"+ options.url +"' size='40'>" +
                                "<div class='toolParamHelp' style='clear: both;'>" +
                                    "If the workflow is accessible via a URL, enter the URL above and click <b>Import</b>." +
                                "</div>" +
                                "<div style='clear: both'></div>" +
                            "</div>" +
                            "<div class='form-row'>" +
                                "<label>Galaxy workflow file:</label>" +
                            "<div class='form-row-input'>" +
                                "<input type='file' name='file_data' class='input-file'/>" +
                            "</div>" +
                            "<div class='toolParamHelp' style='clear: both;'>" +
                                "If the workflow is in a file on your computer, choose it and then click <b>Import</b>." +
                            "</div>" +
                            "<div style='clear: both'></div>" +
                            "</div>" +
                            "<div class='form-row'>" +
                                "<input type='submit' class='primary-button wf-import' name='import_button' value='Import'>" +
                            "</div>" +
                            "</form>" +
                           "<hr/>" +
                           "<div class='form-row'>" +
                               "<label>Import a Galaxy workflow from myExperiment:</label>" +
                               "<div class='form-row-input'>" +
                                   "<a href='" + options.myexperiment_target_url + "'> Visit myExperiment</a>" +
                               "</div>" +
                               "<div class='toolParamHelp' style='clear: both;'>" +
                                   "Click the link above to visit myExperiment and browse for Galaxy workflows." +
                               "</div>" +
                               "<div style='clear: both'></div>" +
                           "</div>" +
                       "</div>" +
                   "</div>";
        },

    });

    return {
        View  : WorkflowListView,
        ImportWorkflowView : ImportWorkflowView
    };
});
