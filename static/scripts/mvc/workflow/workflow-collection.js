define([ "mvc/base-mvc", "mvc/workflow/workflow-model" ], function(baseMVC) {
    {
        var logNamespace = "workflow";
        Backbone.Collection.extend(baseMVC.LoggableMixin).extend({
            _logNamespace: logNamespace,
            defaults: {
                content: ""
            },
            initialize: function() {
                console.log("Initialize Workflow Model");
            },
            entryType: function() {
                return this.entry ? this.entry.EntryType : void 0;
            },
            fields: function() {
                return this._fields;
            }
        });
    }
});