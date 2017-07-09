<template>
    <!-- <section class="hero film">
            <div class="player">
                <div class="player-wrapper">
                    <iframe id="youtube-player" data-video="Z-dN0AJQa-E" frameborder="0" allowfullscreen="1" title="YouTube video player" width="640" height="360" src="https://www.youtube.com/embed/Z-dN0AJQa-E?showinfo=0&amp;autoplay=0&amp;iv_load_policy=3&amp;fs=1&amp;playsinline=0&amp;rel=0&amp;enablejsapi=1&amp;origin=https%3A%2F%2Fpetrolicious.com&amp;widgetid=1"></iframe>
                </div>
            </div>
    </section> -->

    <!-- <section class="hero is-primary is-medium">
  <div class="hero-body">
    <div class="container has-text-centered2">
        <iframe width="560" height="315" src="https://www.youtube.com/embed/ElWN4B4Wvxw?autoplay=0" frameborder="0" allowfullscreen></iframe>
    </div>
  </div>
</section> -->

    <!-- <section class="hero is-small film">
        <div class="hero-body" style="padding:0">
            <div class="container">
                <div class="video-container">
                    <iframe id="youtube-player" data-video="Z-dN0AJQa-E" frameborder="0" allowfullscreen="1" title="YouTube video player" width="640" height="360" src="https://www.youtube.com/embed/Z-dN0AJQa-E?showinfo=0&amp;autoplay=0&amp;iv_load_policy=3&amp;fs=1&amp;playsinline=0&amp;rel=0&amp;enablejsapi=1&amp;origin=https%3A%2F%2Fpetrolicious.com&amp;widgetid=1"></iframe>
                </div>
            </div>
        </div>
    </section> -->

    <section class="bgBlack">
        <div class="player">
            <div class="wrapper">
                <iframe frameborder="0" allowfullscreen="1" title="YouTube video player" width="640" height="360" src="https://www.youtube.com/embed/ElWN4B4Wvxw?showinfo=0&amp;autoplay=0&amp;iv_load_policy=3&amp;fs=1&amp;playsinline=0"></iframe>
            </div>
        </div>
    </section>
</template>

<script>
    export default {
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

<style>
</style>
