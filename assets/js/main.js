function $(a) {return document.querySelector(a)}
function $$(a) {return document.querySelectorAll(a)}
var audio_main = $(".audio_main")
var List_music = [
    {
        name:"Hãy Trao cho Anh - Sơn Tùng MTP",
        link:"./assets/audio/Hay_trao_cho_anh.mp3",
        product:"Sơn Tùng - MTP",
        music_id:1
    },
    {
        name:"Một bước yêu vạn dặm đau - MR Siro",
        link:"./assets/audio/Mot_buoc_yeu.mp3",
        product:"MR - Siro",
        music_id:2
    },
    {
        name:"Nơi Này có anh - Sơn Tùng MTP",
        link:"./assets/audio/Noi_nay_co_anh.mp3",
        product:"Sơn Tùng - MTP",
        music_id:3
    },
    {
        name:"Alone - Alan Walker",
        link:"./assets/audio/Alone.mp3",
        product:"Alan Walker",
        music_id:4
    },
    {
        name:"Đừng làm trái tim anh đau - Sơn Tùng MTP",
        link:"./assets/audio/Dung_lam_trai_tim_anh_dau.mp3",
        product:"Sơn Tùng - MTP",
        music_id:5
    },
    {
        name:"Lạc Trôi - Sơn Tùng MTP",
        link:"./assets/audio/Lac_Troi.mp3",
        product:"Sơn Tùng - MTP",
        music_id:6
    },
    {
        name:"Faded",
        link:"./assets/audio/faded.mp3",
        product:"Alan Walker",
        music_id:7
    },
    {
        name:"Simp Gái 808",
        link:"./assets/audio/simp_gai_808.mp3",
        product:"Low G",
        music_id:8
    },
    {
        name:"Thủ Đô Cyper",
        link:"./assets/audio/thu_do_cyper.mp3",
        product:"Rapital",
        music_id:9
    },
    {
        name:"Dance monkey",
        link:"./assets/audio/dance_monkey.mp3",
        product:"Tone and I",
        music_id:10
    }
]


function main() {
    setTimeout(()=>{
        $(".bg_load").style.display = "none"
        loadConfig()
        render_list_music()
        addEvent()
        render_display(List_music[0])
        timer_line()
        btn_selec_audio()
    },200)
}

main()


// addEvent to page

function addEvent() {
    $$(".audio_btn")[0].addEventListener("click",play_audio)
    $(".audio_forward").addEventListener("click",next_audio)
    
    audio_main.addEventListener("ended",()=>{
        play_audio()
        if (!$(".audio_btn_active")) {
            normal_play_audio()
            play_audio()
        } else if ($(".audio_btn_active").classList.value.includes("audio_repeat")) {
            play_audio()
        } else if ($(".audio_btn_active").classList.value.includes("audio_shuffle")) {
            shuffle_play_audio()
            play_audio()
        }
    })
    
    $(".audio_head_icon_box").addEventListener("click",play_audio)
    
    $("html").addEventListener("keypress",(e)=>{
        switch (e.keyCode) {
            case 32:
                play_audio()
                break
        }
    })

    // volume Event

    $(".audio_volume_range").addEventListener("input",volume_control_audio)
    $(".audio_icon_volume").addEventListener("mousedown",volume_icon_muted)

    // list Event

    $$(".audio_list_items").forEach(list_active)

}

var rotateEvent = $(".audio_head_img").animate([
    {transform: "rotate(360deg)"}
],{
    duration: 8000,
    iterations: Infinity
})
rotateEvent.pause()

// btn selector audio
function btn_selec_audio() {
    $$(".audio_btn_select").forEach((audio_btn)=>{
        audio_btn.addEventListener("click",()=>{
            if (audio_btn.classList.value.includes("audio_btn_active")) {
                $(".audio_btn_active").classList.remove("audio_btn_active")
                setConfig()
                return
            }
            if ($(".audio_btn_active")) {
                $(".audio_btn_active").classList.remove("audio_btn_active")
            }
            audio_btn.classList.add("audio_btn_active")
            setConfig()
        })
    })
}

// load config
function loadConfig() {
    var PLAYER_CONFIG = JSON.parse(localStorage.getItem("MY_SETTING_CONFIG")) || {}
    if (PLAYER_CONFIG.repeat) {
        $(".audio_repeat").classList.add("audio_btn_active")
    } else if (PLAYER_CONFIG.shuffle) {
        $(".audio_shuffle").classList.add("audio_btn_active")
    }
    if (PLAYER_CONFIG.volume < 100) {
        var icon_volume = $(".audio_icon_volume")
        audio_main.volume = PLAYER_CONFIG.volume/100
        $(".audio_volume_range").value = PLAYER_CONFIG.volume
        if (PLAYER_CONFIG.volume == 0) {icon_volume.innerHTML = `<i class="fa-solid fa-volume-xmark audio_icon"></i>`;$(".audio_volume_range").setAttribute("value_before_muted","100")}
        else if (PLAYER_CONFIG.volume <= 30) {icon_volume.innerHTML = `<i class="fa-solid fa-volume-off audio_icon"></i>`}
        else {icon_volume.innerHTML = `<i class="fa-solid fa-volume-low audio_icon"></i>`}
    }
}

// set config
function setConfig() {
    var NEW_SETTING = {
        repeat: $(".audio_repeat").classList.value.includes("audio_btn_active"),
        shuffle: $(".audio_shuffle").classList.value.includes("audio_btn_active"),
        volume: $(".audio_volume_range").value
    }
    localStorage.setItem("MY_SETTING_CONFIG",JSON.stringify(NEW_SETTING))
}
// audio display
function settime_current() {
    if(audio_main.classList.value.includes("timer_set_run")) {return}
    else {audio_main.classList.add("timer_set_run")}
    let cur_time_minute = $(".minute_current_time")
    let cur_time_second = $(".second_current_time")
    var second
    var I = setInterval(()=>{
        let current_time = Math.floor(audio_main.currentTime)
        if (current_time>=60) {
            var minute = Math.floor(current_time/60)
            current_time - minute*60<10?second = "0"+(current_time - minute*60):second = current_time - minute*60
        } else {
            var minute = 0
            current_time<10?second = "0"+current_time:second = current_time
        }
        cur_time_minute.textContent = minute
        cur_time_second.textContent = second
    },0)
}
function render_display(current_music) {
    $(".audio_head_name").innerHTML = current_music.name
    $(".audio_head_produce").innerHTML = current_music.product
    audio_main.setAttribute("music_id",current_music.music_id)
    audio_main.innerHTML = `
    <source src="${current_music.link}" type="audio/mpeg">
    `
    $(".audio_head_img").src = `./assets/img/music_img_${current_music.music_id}.jpg`
    if ($(".list_item_active")) {$(".list_item_active").classList.remove("list_item_active")}
    $(`.music_id_${current_music.music_id}`).classList.add("list_item_active")
    setTimeout(scrollToTop,200)
    audio_main.load()    
}
function render_list_music() {
    var HTMLs = ""
    List_music.forEach(music=>{
        HTMLs += `
        <div music_id="${music.music_id}" class="audio_list_items music_id_${music.music_id}">
            <img class="list_item_img" src="./assets/img/music_img_${music.music_id}.jpg" alt="">
            <div class="list_item_body">
                <h3 class="list_item_head">${music.name}</h3>
                <p class="list_item_product">${music.product}</p>
            </div>
            <i class="fa-solid fa-music list_item_icon"></i>
        </div>
        `
    })
    $(".audio_list_box").innerHTML = HTMLs
}

// play audio
function play_audio() {
    if ($$(".audio_btn")[0].classList.value.includes("audio_pause")) {
        audio_main.play()
        $$(".audio_btn")[0].classList.remove("audio_pause")
        $$(".audio_btn")[0].classList.add("audio_play")
        $(".audio_icon_pause").classList.add("audio_disnone")
        $(".audio_icon_play").classList.remove("audio_disnone")
        rotateEvent.play()
        settime_current()
    } else {
        audio_main.pause()
        $$(".audio_btn")[0].classList.remove("audio_play")
        $$(".audio_btn")[0].classList.add("audio_pause")
        $(".audio_icon_play").classList.add("audio_disnone")
        $(".audio_icon_pause").classList.remove("audio_disnone")
        rotateEvent.pause()
    }
}
// next audio
function next_audio() {
    var music_cur_id = Number(audio_main.getAttribute("music_id"))
    if (music_cur_id==List_music.length) {music_cur_id=0}
    var music_next = List_music.find((music_item)=>{return music_item.music_id==music_cur_id+1})
    if ($$(".audio_btn")[0].classList.value.includes("audio_play")) {
        $$(".audio_btn")[0].classList.remove("audio_play")
        $$(".audio_btn")[0].classList.add("audio_pause")
        $(".audio_icon_play").classList.add("audio_disnone")
        $(".audio_icon_pause").classList.remove("audio_disnone")
        rotateEvent.cancel()
        rotateEvent.pause()
    }
    rotateEvent.cancel()
    render_display(music_next)
}
// timer audio
function timer_line() {
    if(audio_main.classList.value.includes("timer_line_run")) {return}
    else {audio_main.classList.add("timer_line_run")}
    setTimer_line()
    setInterval(()=>{
        let full_time = Math.floor(audio_main.duration)
        let current_time = Math.floor(audio_main.currentTime)
        let percenLine = current_time/full_time * 100
        $(".audio_linecurrent").style.width = $(".audio_linetime").offsetWidth*percenLine/100+"px"
    },10)
}
function setTimer_line() {
    let audio_linetime = $(".audio_linetime")
    audio_linetime.addEventListener("mousedown",set_prog)
    audio_linetime.addEventListener("mousedown",()=>{
        audio_linetime.addEventListener("mousemove",set_prog)
        audio_linetime.style.cursor = "pointer"
    })
    $("html").addEventListener("mouseup",()=>{
        audio_linetime.removeEventListener("mousemove",set_prog)
        audio_linetime.style.cursor = "default"
    })
    function set_prog(e) {
        if (e.target.classList.value.includes("audio_line_cir")) {return}
        var new_time = (e.offsetX/audio_linetime.offsetWidth)*audio_main.duration
        $(".audio_linecurrent").style.width = e.offsetX
        audio_main.currentTime = new_time
    }
}
// shuffle audio
function shuffle_play_audio() {
    let random_id_music = Math.floor(Math.random()*List_music.length+1)
    var music_cur_id = Number(audio_main.getAttribute("music_id"))
    while (random_id_music == music_cur_id) {random_id_music=Math.floor(Math.random()*3+1)}
    var music_shuffle = List_music.find((music_item)=>{return music_item.music_id==random_id_music})
    rotateEvent.cancel()
    render_display(music_shuffle)
}
// normal audio
function normal_play_audio() {
    var music_cur_id = Number(audio_main.getAttribute("music_id"))
    if (music_cur_id==List_music.length) {music_cur_id=0}
    var music_next = List_music.find((music_item)=>{return music_item.music_id==music_cur_id+1})
    rotateEvent.cancel()
    render_display(music_next)
}
// volume audio
function volume_control_audio(e) {
    audio_main.volume = e.target.value/100
    var icon_volume = $(".audio_icon_volume")
    if (e.target.value == 0) {icon_volume.innerHTML = `<i class="fa-solid fa-volume-xmark audio_icon"></i>`;e.target.setAttribute("value_before_muted","100")}
    else if (e.target.value <= 30) {icon_volume.innerHTML = `<i class="fa-solid fa-volume-off audio_icon"></i>`}
    else if (e.target.value <= 60) {icon_volume.innerHTML = `<i class="fa-solid fa-volume-low audio_icon"></i>`}
    else {icon_volume.innerHTML = `<i class="fa-solid fa-volume-high audio_icon"></i>`}
    setConfig()
}
function volume_icon_muted(e) {
    var icon_volume = $(".audio_icon_volume")
    var audio_volume_range = $(".audio_volume_range")
    if (e.target.classList.value.includes("fa-volume-xmark")) {
        audio_volume_range.value = audio_volume_range.getAttribute("value_before_muted")
        audio_main.volume = audio_volume_range.value/100
        if (audio_volume_range.value <= 30) {icon_volume.innerHTML = `<i class="fa-solid fa-volume-off audio_icon"></i>`}
        else if (audio_volume_range.value <= 60) {icon_volume.innerHTML = `<i class="fa-solid fa-volume-low audio_icon"></i>`}
        else {icon_volume.innerHTML = `<i class="fa-solid fa-volume-high audio_icon"></i>`}
    } else {
        audio_main.volume = 0
        icon_volume.innerHTML=`<i class="fa-solid fa-volume-xmark audio_icon"></i>`
        audio_volume_range.setAttribute("value_before_muted",audio_volume_range.value)
        audio_volume_range.value = 0
    }
    setConfig()
}
// list music
function list_active(list_item) {
    list_item.addEventListener("click",()=>{
        if (list_item.classList.value.includes("list_item_active")) {return}
        $(".list_item_active").classList.remove("list_item_active")
        list_item.classList.add("list_item_active")
        render_display(List_music.find((music)=>{
            return music.music_id == list_item.getAttribute("music_id")
        }))
        rotateEvent.cancel()
        if ($(".audio_btn").classList.value.includes("audio_play")) {
            $(".audio_btn").classList.remove("audio_play")
            $(".audio_btn").classList.add("audio_pause")
            $(".audio_icon_play").classList.add("audio_disnone")
            $(".audio_icon_pause").classList.remove("audio_disnone")
            rotateEvent.cancel()
        }
    })
}
// scroll to top music
function scrollToTop() {
    $(".list_item_active").scrollIntoView({
        behavior: "smooth",
        block: "end"
    })
}
