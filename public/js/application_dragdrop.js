var CONNECT_INSTALLER =  "//d3gcli72yxqn2z.cloudfront.net/connect/v4";

var initAsperaConnect  = function () {
  this.asperaWeb = new AW4.Connect({sdkLocation: CONNECT_INSTALLER, minVersion: "3.6.1", dragDropEnabled: true});
  var asperaInstaller = new AW4.ConnectInstaller({sdkLocation: CONNECT_INSTALLER});
  var statusEventListener = function (eventType, data) {
    if (eventType === AW4.Connect.EVENT.STATUS && data == AW4.Connect.STATUS.INITIALIZING) {
      asperaInstaller.showLaunching();
   } else if (eventType === AW4.Connect.EVENT.STATUS && data == AW4.Connect.STATUS.FAILED) {
     asperaInstaller.showDownload();
   } else if (eventType === AW4.Connect.EVENT.STATUS && data == AW4.Connect.STATUS.OUTDATED) {
     asperaInstaller.showUpdate();
   } else if (eventType === AW4.Connect.EVENT.STATUS && data == AW4.Connect.STATUS.RUNNING) {
     asperaInstaller.connected();
   }
  };
  asperaWeb.addEventListener(AW4.Connect.EVENT.STATUS, statusEventListener);
  asperaWeb.initSession();
  setup();
};

var setup = function () {
  var options = {
    "dragEnter":true,
    "dragLeave":true,
    "dragOver":true,
    "drop":true
  };
  asperaWeb.setDragDropTargets("#drag-drop-area", options, dragEvent);
};

var dragEvent = function(dragDropObject) {
  if (dragDropObject.event.type === "dragenter") {
    $("#drag-drop-area").addClass("dragging");
  }
  else if (dragDropObject.event.type === "dragleave") {
    $("#drag-drop-area").removeClass("dragging");
  }
  else if (dragDropObject.event.type === "drop") {
    $("#drag-drop-area").removeClass("dragging");
    $("#output-files").text("Files Dropped: \n\n" + JSON.stringify(dragDropObject.files, null, 2));
    if($("#enableTransfer").prop('checked'))
    {
      performUpload(dragDropObject.files);
    }
  }
};

performUpload = function (pathArray) {
    transferSpec = {
        "paths": [],
        "remote_host": "demo.asperasoft.com",
        "remote_user": "aspera",
        "remote_password": "demoaspera",
        "direction": "send",
        "target_rate_kbps" : 5000,
        "resume" : "sparse_checksum",
        "destination_root": "Upload"
    };

    connectSettings = {
        "allow_dialogs": "yes"
    };
 	var files = pathArray.dataTransfer.files;
    for (var i = 0, length = files.length; i < length; i +=1) {
        transferSpec.paths.push({"source":files[i].name});
    }

    if (transferSpec.paths.length === 0) {
      return;
    }
    $("#output-data").text("transferSpec: \n\n" + JSON.stringify(transferSpec, null, 2) + "\n\n");
    asperaWeb.startTransfer(transferSpec, connectSettings);
};
