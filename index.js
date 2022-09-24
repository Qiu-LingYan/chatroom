<script>
        var im;//WebSocket对象
        function initIm() {
            var user=$('#txtUserName').val();
            im = new MyIm(window.location.hostname, window.location.port, user);
            $('.online').show();
            $('.offline').hide();
            im.Init();
        }

        //创建一个对象 里面有3个方法，分别为Init：初始化Socket连接、Send：发送消息、Colse：关闭连接
        var MyIm = function (path, prot, user_name) {
            this.requestPath = 'ws://' + path + ':' + prot + '/tools/Handler.ashx';
            this.user_name = user_name;
            this.param = '?user_name=' + this.user_name;
            this.socekt;

        }
        MyIm.prototype = {
            Init: function () {
                this.socekt = new WebSocket(this.requestPath + this.param);
                this.socekt.onopen = function () {
                    addSysMessage('连接成功','')
                };//连接成功
                this.socekt.onmessage = function (result) {
                    //这里返回的消息为json格式，里面的data为服务器返回的内容
                    var json = eval('(' + result.data + ')');
                    if (Number(json.Status) == 1) {
                        addSysMessage(json.Contents,json.Time)
                    } else {
                        addMessage(json);
                    }
                };//接收到消息的时候
                this.socekt.onclose = function (result) {
                    addSysMessage('我的连接关闭了','')
                }//连接关闭的时候
                this.socekt.onerror = function (result) {
                    addSysMessage('网络发生了错误', '');//当这一步被执行时，close会被自动执行，所以无需主动去执行关闭方法
                }//当连接发生错误的时候
            },
            Send: function (msg) {
                //这里可以直接发送消息给服务器，但是为了让服务器好区分我的消息是属于通知还是普通消息还是其他，所以做成了json
                //后台获取到json，解析后针对不同的消息类型进行处理
                var json = '{"Status":0,"Contents":"'+msg+'","Source":"'+this.user_name+'","Aim":""}';
                this.socekt.send(json);
            },
            Close: function () {
                if (this.socekt != null) {
                    this.socekt.close();
                    return;
                }
            }
        }
        //把通知消息载入到通知列表
        function addSysMessage(msg, time) {
            if (time.length <= 0) {
                time = new Date();
            }
            $('.messageBox').append('<li><p class="time">' + time + '</p><p class=\"message\">' + msg + '</p></li>');
        }
        //把聊天消息载入到聊天框
        function addMessage(json) {
            $('.mainBox').append('<li><p class="time">' + json.Time + '</p><p class=\"message\"><span>'+json.Source+'说：</span>' + json.Contents + '</p></li>');
        }
        //发送消息
        function sendMsg() {
            var contents = $('#txtContents').val();
            im.Send(contents);
        }
        //关闭连接
        function offLine() {
            im.Close();

            $('.online').hide();
            $('.offline').show();
        }
    </script>
