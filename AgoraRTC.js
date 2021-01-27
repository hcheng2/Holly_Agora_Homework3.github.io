let handlefail = function(err){
    console.log(err);
}

function addVideoStream(streamId){
    let remoteContainer = document.getElementById("remote-stream");
    let streamDiv = document.createElement("div");
    streamDiv.id = streamId;
    streamDiv.style.transform = "rotateY(180deg)";
  //  streamDiv.style.height = "600px";
    remoteContainer.appendChild(streamDiv);
}

document.getElementById("join").onclick = function(){
    let channelName = document.getElementById("channel").value;
    let username = document.getElementById("username").value;
    let appID = "2400b34296a64a5295504ebc9e2a741f";
    
    let client = AgoraRTC.createClient({
        mode: "live",
        codec: "h264"    
    })
    client.init(appID,() => console.log("AgoraRTC connected"), handlefail)
    client.join(
        null,
        channelName,
        username,
        ()=>{
            var localStream = AgoraRTC.createStream({
                video: true,
                audio: true,
            })
            localStream.init(function(){
                localStream.play("self-stream")
                console.log(`App id: ${appId}\nChannel id: ${channelName}`)
                client.publish(localStream);
            })
        }
    )
}