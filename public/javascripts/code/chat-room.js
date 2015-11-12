var socket = null;
var isFirstConnect = true;
// 處理連接事件
function connect() {
  socket = io.connect("http://" + $("#host").val() + ":9000", {'reconnect':false});

  // 註冊連接事件
  socket.on("connect", function() {
    alert("伺服器連接成功！");

    // 第一次連接
    if(isFirstConnect) {
      isFirstConnect = false;
      regEvent();
      $('#smsg').focus();
    } else {
      socket.socket.reconnect();
    }
  });
}
// 註冊事件
function regEvent() {
  // 註冊接收訊息事件
	socket.on("message", function(msg) {
		$("#rmsg").text($("#rmsg").text() + msg + "\r\n");
	});

  //註冊自訂處理事件
	socket.on("receiveMsg", function(msg) {
		$("#rmsg").text($("#rmsg").text() + msg + "\r\n");
    $('#smsg').val("");
    $('#smsg').focus();
	});
}

// 處理傳送訊息
function sendMsg() {
  if($('#smsg').val() === "") {
    alert("訊息欄位不可為空！");
    return;
  }
	if(socket != null) {
		// socket.send($("#smsg").val());
		getIP(function(ip) {
      // 將訊息JSON物件傳送到已連接之Socket
			socket.emit("receiveMsg", {'name':ip, 'msg':$('#smsg').val()});
		});
	} else {
    alert("尚未連接伺服器！");
  }
}

function getIP(callback) {
	$.get("http://ipinfo.io", function(response) {
		callback(response.ip);
	}, "jsonp");
}