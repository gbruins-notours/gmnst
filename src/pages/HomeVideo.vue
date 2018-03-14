<script>
import DefaultLayout from '@/layouts/DefaultLayout'

export default {
    components: {
        DefaultLayout
    },

    data: function() {
        return {
            video: {
                playButtonText: this.$t('Play'),
                muteButtonText: this.$t('Mute'),
            }
        }
    },

    methods: {
        togglePlayVideo: function(e) {
            e.preventDefault();
            let $vid = this.$refs['video-element']

            if ($vid.paused) {
                $vid.play();
                this.video.playButtonText = this.$t('Pause');
            }
            else {
                $vid.pause();
                this.video.playButtonText = this.$t('Play');
            }
        },

        toggleMuteVideo: function(e) {
            e.preventDefault();
            let $vid = this.$refs['video-element']

            $vid.muted = $vid.muted ? false : true;
            this.video.muteButtonText = $vid.muted ? this.$t('Mute') : this.$t('Unmute');
        }
    }

}
</script>


<template>
    <default-layout>
        <section class="bgBlack">
            <div class="player">
                <div class="wrapper">
                    <iframe frameborder="0" allowfullscreen="1" title="YouTube video player" width="640" height="360" src="https://www.youtube.com/embed/ElWN4B4Wvxw?showinfo=0&amp;autoplay=0&amp;iv_load_policy=3&amp;fs=1&amp;playsinline=0"></iframe>
                </div>
            </div>
        </section>
    </default-layout>
</template>