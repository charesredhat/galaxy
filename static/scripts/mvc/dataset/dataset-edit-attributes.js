define(["utils/utils","mvc/ui/ui-tabs","mvc/ui/ui-misc","mvc/form/form-view"],function(a,b,c,d){var e=Backbone.View.extend({initialize:function(){this.setElement("<div/>"),this.model=new Backbone.Model({dataset_id:Galaxy.params.dataset_id}),this.render()},render:function(){var b=Galaxy.root+"dataset/edit",c=this;a.get({url:b,data:{dataset_id:c.model.get("dataset_id")},success:function(a){c.render_attribute_page(c,a)},error:function(){var a={status:"error",message:"Error occured while loading the dataset.",persistent:!0,cls:"errormessage"};c.display_message(a,c.$(".response-message"))}})},render_attribute_page:function(a,b){var c={message:b.message,status:b.status,persistent:!0,cls:b.status+"message"};a.$el.empty().append(a._templateHeader()),a.display_message(c,a.$(".response-message")),a.create_tabs(b,a.$(".edit-attr"))},call_ajax:function(a,b){var c=Galaxy.root+"dataset/edit";$.ajax({type:"PUT",url:c,data:b,success:function(b){a.render_attribute_page(a,b),a.reload_history()},error:function(){var b={status:"error",message:"Error occured while saving. Please fill all the required fields and try again.",persistent:!0,cls:"errormessage"};a.display_message(b,a.$(".response-message"))}})},display_message:function(a,b){b.empty().html(new c.Message(a).$el)},create_tabs:function(a,c){var d=this;d.tabs=new b.View,d.tabs.add({id:"attributes",title:"Attributes",icon:"fa fa-bars",tooltip:"Edit dataset attributes",$el:d._getAttributesFormTemplate(a)}),d.tabs.add({id:"convert",title:"Convert",icon:"fa-gear",tooltip:"Convert to new format",$el:d._getConvertFormTemplate(a)}),d.tabs.add({id:"datatype",title:"Datatypes",icon:"fa-database",tooltip:"Change data type",$el:d._getChangeDataTypeFormTemplate(a)}),d.tabs.add({id:"permissions",title:"Permissions",icon:"fa-user",tooltip:"Permissions",$el:d._getPermissionsFormTemplate(a)}),c.append(d.tabs.$el),d.tabs.showTab("attributes")},_templateHeader:function(){return'<div class="page-container edit-attr"><div class="response-message"></div><h3>Edit Dataset Attributes</h3></div>'},_getAttributesFormTemplate:function(a){var b=this,e=new d({title:"Edit attributes",inputs:a.edit_attributes_inputs,operations:{submit_editattr:new c.ButtonIcon({tooltip:"Save attributes of the dataset.",icon:"fa-floppy-o ",title:"Save attributes",onclick:function(){b._submit(b,e,a,"edit_attributes")}}),submit_autocorrect:new c.ButtonIcon({tooltip:"This will inspect the dataset and attempt to correct the values of fields if they are not accurate.",icon:"fa-undo ",title:"Auto-detect",onclick:function(){b._submit(b,e,a,"auto-detect")}})}});return e.$el},_getConvertFormTemplate:function(a){var b=this,e=new d({title:"Convert to new format",inputs:a.convert_inputs,operations:{submit:new c.ButtonIcon({tooltip:"Convert the datatype to a new format.",title:"Convert datatype",icon:"fa-exchange ",onclick:function(){b._submit(b,e,a,"convert")}})}});return e.$el},_getChangeDataTypeFormTemplate:function(a){var b=this,e=new d({title:"Change datatype",inputs:a.convert_datatype_inputs,operations:{submit:new c.ButtonIcon({tooltip:"Change the datatype to a new type.",title:"Change datatype",icon:"fa-exchange ",onclick:function(){b._submit(b,e,a,"change")}})}});return e.$el},_getPermissionsFormTemplate:function(a){var b=this;if(a.can_manage_dataset){var e=new d({title:"Manage dataset permissions on "+a.display_name,inputs:a.permission_inputs,operations:{submit:new c.ButtonIcon({tooltip:"Save permissions.",title:"Save permissions",icon:"fa-floppy-o ",onclick:function(){b._submit(b,e,a,"permissions")}})}});return e.$el}var e=new d({title:"View permissions",inputs:a.permission_inputs});return e.$el},_submit:function(a,b,c,d){var e=b.data.create();switch(e.dataset_id=c.dataset_id,d){case"edit_attributes":e.save="Save";break;case"auto-detect":e.detect="Auto-detect";break;case"convert":null!==e.target_type&&e.target_type&&(e.dataset_id=c.dataset_id,e.convert_data="Convert");break;case"change":e.change="Save";break;case"permissions":var f={};f.permissions=JSON.stringify(e),f.update_roles_button="Save",f.dataset_id=c.dataset_id,e=f}a.call_ajax(a,e)},reload_history:function(){window.Galaxy&&window.Galaxy.currHistoryPanel.loadCurrentHistory()}});return{View:e}});
//# sourceMappingURL=../../../maps/mvc/dataset/dataset-edit-attributes.js.map