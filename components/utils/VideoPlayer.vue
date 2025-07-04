<script setup>
	import screenfull from 'screenfull'

	const { isTouch, isSafari, isAndroid, isIos, isSamsung } = useDevice()

	const props = defineProps({
		vimeoUrl: {
			type: String,
			required: true,
			default: ''
		},
		poster: {
			type: Object,
			required: true
		},
		publicUrl: {
			type: String,
			required: false,
			default: ''
		}
	})

	const hasPlayed = shallowRef(false)
	const showBigPlayButton = shallowRef(true)

	const $main = ref(null)
	const $video = ref(null)
	const $timeline = ref(null)

	const videoCurrentTime = ref(0)
	const videoFormatedCurrentTime = ref(formatTime(videoCurrentTime.value))
	const videoDuration = ref(null)
	const videoFormatedDuration = ref(formatTime(videoDuration.value))

	const isPlaying = ref(false)
	const isMuted = ref(false)
	const isFullscreen = ref(false)
	const isLoaded = ref(false)

	let raf = null

	function setVideoData() {
		videoDuration.value = $video.value.duration
		videoFormatedDuration.value = formatTime(videoDuration.value)
		isLoaded.value = true
	}

	function onPlayBtnClick() {
		hasPlayed.value = true
		showBigPlayButton.value = false
		isPlaying.value = true
		$video.value.play()
		raf = window.requestAnimationFrame(onUpdate)
	}

	function onPauseBtnClick() {
		isPlaying.value = false
		showBigPlayButton.value = true
		$video.value.pause()
		window.cancelAnimationFrame(raf)
	}

	function onUpdate() {
		videoCurrentTime.value = $video.value.currentTime
		raf = window.requestAnimationFrame(onUpdate)
	}

	function onVisualClick() {
		isPlaying.value = !isPlaying.value

		if (isPlaying.value === true) {
			onPlayBtnClick()
		} else {
			onPauseBtnClick()
		}
	}

	function onToggleMuteBtnClick() {
		isMuted.value = !isMuted.value

		if (isMuted.value === true) {
			$video.value.muted = true
		} else {
			$video.value.muted = false
		}
	}

	function onFullscreenBtnClick() {
		if (isIos || isAndroid || isSamsung) {
			if ($video.value) {
				try {
					if ($video.value.webkitEnterFullscreen) {
						$video.value.webkitEnterFullscreen();
					} else if ($video.value.enterFullscreen) {
						$video.value.enterFullscreen();
					} else if ($video.value.requestFullscreen) {
						$video.value.requestFullscreen();
					} else if ($video.value.webkitRequestFullscreen) {
						$video.value.webkitRequestFullscreen();
					}
					isFullscreen.value = true;
				} catch (error) {
					console.error('Erreur lors du passage en plein écran:', error);
				}
			}
		} else {
			if (screenfull.isEnabled) {
				screenfull.request($main.value);
				isFullscreen.value = true;
			}
		}
	}

	function onMinimizeBtnClick() {
		if (isIos || isAndroid || isSamsung) {
			try {
				if ($video.value.webkitExitFullscreen) {
					$video.value.webkitExitFullscreen();
				} else if ($video.value.exitFullscreen) {
					$video.value.exitFullscreen();
				}
				isFullscreen.value = false;
			} catch (error) {
				console.error('Erreur lors de la sortie du plein écran:', error);
			}
		} else {
			if (screenfull.isEnabled) {
				screenfull.exit();
				isFullscreen.value = false;
			}
		}
	}

	function onShareBtnClick() {
		if (props.publicUrl) {
			window.open(props.publicUrl, '_blank')
		} else {
			console.warn('No public URL available for this video')
		}
	}

	onMounted(() => {
		screenfull.on('change', onScreenfullChange)

		if (!isLoaded) {
			setVideoData()
		}
	})

	function onScreenfullChange() {
		isFullscreen.value = screenfull.isFullscreen
	}

	function onVideoTimeUpdate() {
		videoFormatedCurrentTime.value = formatTime($video.value.currentTime)
	}

	function formatTime(time) {
		const minutes = Math.floor(time / 60)
		const seconds = Math.floor(time % 60)
		const formatedSeconds = seconds < 10 ? `0${ seconds }` : seconds

		return `${ minutes }:${ formatedSeconds }`
	}

	function onTimelineClick(event) {
		seekOnTimeline(event.clientX)
	}

	function seekOnTimeline(userX) {
		const timelineLeft = $timeline.value.getBoundingClientRect().left
		const timelineWidth = $timeline.value.getBoundingClientRect().width
		const userXRelativeToTimeline = userX - timelineLeft

		const seekTime = (userXRelativeToTimeline / timelineWidth) * videoDuration.value

		$video.value.currentTime = seekTime

		onPlayBtnClick()
	}

	let isDragging = false

	function onTimelineMousedown(event) {
		isDragging = true
		document.addEventListener('mousemove', onTimelineMousemove)
		document.addEventListener('mouseup', onTimelineMouseup)
		seekOnTimeline(event.clientX)
	}

	function onTimelineMousemove(event) {
		if (isDragging) {
			seekOnTimeline(event.clientX)
		}
	}

	function onTimelineMouseup() {
		isDragging = false
		document.removeEventListener('mousemove', onTimelineMousemove)
		document.removeEventListener('mouseup', onTimelineMouseup)
	}

	function onTimelineTouchstart(event) {
		document.addEventListener('touchmove', onTimelineTouchmove)
		document.addEventListener('touchend', onTimelineTouchend)
		seekOnTimeline(event.touches[0].clientX)
	}

	function onTimelineTouchmove(event) {
		seekOnTimeline(event.touches[0].clientX)
	}

	function onTimelineTouchend() {
		document.removeEventListener('touchmove', onTimelineTouchmove)
		document.removeEventListener('touchend', onTimelineTouchend)
	}

	function onVideoEnded() {
		isPlaying.value = false
		showBigPlayButton.value = true
	}

	onBeforeUnmount(() => {
		window.cancelAnimationFrame(raf)
		document.removeEventListener('mousemove', onTimelineMousemove)
		document.removeEventListener('mouseup', onTimelineMouseup)
		document.removeEventListener('touchmove', onTimelineTouchmove)
		document.removeEventListener('touchend', onTimelineTouchend)
	})
</script>

<template>
	<div ref="$main" class="VideoPlayer">
		<SanityImage
			class="poster"
			:class="{ 'is-hidden': hasPlayed }"
			:asset-id="poster.asset._ref"
			auto="format"
			:q="75"
		/>
		<button
			v-show="showBigPlayButton"
			class="big-play-button"
			type="button"
			@click="onPlayBtnClick"
		>
		<svg
							width="80"
							height="80"
							viewBox="0 0 17 16"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M3 12.5V3.5L14 8L3 12.5Z"
								fill="white"
							></path>
						</svg>
		</button>
		<video
			ref="$video"
			:src="vimeoUrl"
			class="video"
			playsinline
			webkit-playsinline
			x5-playsinline
			x5-video-player-type="h5"
			x5-video-player-fullscreen="true"
			controlsList="nodownload"
			@click="onVisualClick"
			@loadedmetadata="setVideoData"
			@timeupdate="onVideoTimeUpdate"
			@ended="onVideoEnded"
		/>
		<div class="controls">
			<div class="flex">
				<div class="controls__play-pause">
					<button
						v-show="!isPlaying"
						class="controls__play"
						type="button"
						@click="onPlayBtnClick"
					>
						<svg
							width="17"
							height="16"
							viewBox="0 0 17 16"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M3 12.5V3.5L14 8L3 12.5Z"
								fill="white"
							></path>
						</svg>
					</button>
					<button
						v-show="isPlaying"
						class="controls__pause"
						type="button"
						@click="onPauseBtnClick"
					>
						<svg
							width="17"
							height="16"
							viewBox="0 0 17 16"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<rect
								x="4"
								y="3.5"
								width="3"
								height="9"
								stroke="white"
							></rect>
							<rect
								x="10"
								y="3.5"
								width="3"
								height="9"
								stroke="white"
							></rect>
						</svg>
					</button>
				</div>
				<!-- <div class="controls__time">
					<div class="controls__current-time">
						{{ videoFormatedCurrentTime }}
					</div>
					<div class="controls__total-time">
						{{ videoFormatedDuration }}
					</div>
				</div> -->
			</div>
			<div class="flex">
				<div class="controls__mute">
					<button
						v-show="!isMuted"
						type="button"
						@click="onToggleMuteBtnClick"
					>
						<svg
							width="17"
							height="16"
							viewBox="0 0 17 16"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<rect
								x="2"
								y="8.5"
								width="3"
								height="5"
								stroke="white"
							></rect>
							<rect
								x="12"
								y="8.5"
								width="3"
								height="5"
								stroke="white"
							></rect>
							<path
								d="M15 8C15 4.41015 12.0899 1.5 8.5 1.5C4.91015 1.5 2 4.41015 2 8"
								stroke="white"
							></path>
						</svg>
					</button>
					<button
						v-show="isMuted"
						type="button"
						@click="onToggleMuteBtnClick"
					>
						<svg
							width="17"
							height="16"
							viewBox="0 0 17 16"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<rect
								x="2"
								y="8.5"
								width="3"
								height="5"
								stroke="#727272"
							></rect>
							<rect
								x="12"
								y="8.5"
								width="3"
								height="5"
								stroke="#727272"
							></rect>
							<path
								d="M15 8C15 4.41015 12.0899 1.5 8.5 1.5C4.91015 1.5 2 4.41015 2 8"
								stroke="#727272"
							></path>
						</svg>
					</button>
				</div>
				<div class="controls__fullscreen">
					<button
						v-show="!isFullscreen"
						type="button"
						@click="onFullscreenBtnClick"
					>
						<svg
							width="17"
							height="16"
							viewBox="0 0 17 16"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M2.5 9V14H9.5V9H2.5ZM8.5 13H3.5V10H8.5V13Z"
								fill="white"
							></path>
							<path
								d="M2.5 2V8H3.5V3H13.5V13H10.5V14H14.5V2H2.5Z"
								fill="white"
							></path>
						</svg>
					</button>
					<button
						v-show="isFullscreen"
						type="button"
						@click="onMinimizeBtnClick"
					>
						<svg
							width="17"
							height="16"
							viewBox="0 0 17 16"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M2.5 14V2H14.5V14H2.5ZM8.5 9H3.5V13H8.5V9Z"
								fill="white"
							></path>
						</svg>
					</button>
				</div>

				<div class="controls__share">
					<button
						type="button"
						@click="onShareBtnClick"
					>
						<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M12.3029 6.08805L12.2573 2.33182L8.31237 6.85913L7.83433 6.3656L11.7793 1.83828L8.33085 1.98722L8.93969 1.2885L12.84 1.15153L12.9117 5.38933L12.3029 6.08805Z" fill="white"/>
							<path d="M14 13.9912V7.99121H13V12.9912H3V2.99121H6V1.99121H2V13.9912H14Z" fill="white"/>
						</svg>
					</button>
				</div>

			</div>


			<div
				ref="$timeline"
				class="controls__timeline"
				@click="onTimelineClick"
				@mousedown="onTimelineMousedown"
				@mouseup="onTimelineMouseup"
				@touchstart="onTimelineTouchstart"
			>
				<div class="controls__timeline-background" />
				<div
					class="controls__timeline-current"
					:style="{
						transform: `translate3d(-${100 - (videoCurrentTime / videoDuration) * 100}%, 0, 0)`,
					}"
				/>
			</div>
		</div>
	</div>
</template>

<style lang="scss">
	.VideoPlayer {
		position: relative;
		cursor: pointer;
		background-color: $black;

		.big-play-button {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			z-index: 2;
			width: 80px;
			height: 80px;
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 0;
		}

		.flex {
			display: flex;
		}

		.poster {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			pointer-events: none;
			object-fit: cover;

			&.is-hidden {
				opacity: 0;
			}
		}

		.video {
			width: 100%;
			height: 100%;
			object-fit: contain;
		}

		&:fullscreen {
			.video {
				max-height: 100vh;
				object-fit: contain;
			}
		}

		&:-webkit-full-screen {
			.video {
				max-height: 100vh;
				object-fit: contain;
			}
		}

		&:-moz-full-screen {
			.video {
				max-height: 100vh;
				object-fit: contain;
			}
		}

		&:-ms-fullscreen {
			.video {
				max-height: 100vh;
				object-fit: contain;
			}
		}

		.controls {
			position: absolute;
			bottom: 0;
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			justify-content: space-between;
			width: 100%;
			padding: 0 1.2rem 1.2rem;
			font-size: $desktop-player;

			@include viewport-480 {
				justify-content: flex-start;
				padding: 0.4rem 0.6rem;
				font-size: $mobile-player;
			}

			button {
				display: block;
				text-transform: uppercase;
				cursor: pointer;

				svg {
					display: block;
					margin: 0 auto;
				}
			}

			&__play-pause {
				order: 0;
			}

			&__time {
				display: flex;
				order: 1;
				margin-left: 1.2rem;
			}

			&__total-time {
				margin-left: 1.2rem;
			}

			&__mute {
				order: 2;
				margin-left: 1.2rem;
			}



			&__fullscreen {
				order: 3;
				margin-left: 1.2rem;

				@include viewport-480 {
					order: 4;
				}
			}

			&__share {
				order: 4;
				margin-left: 1.2rem;

				@include viewport-480 {
					order: 5;
				}
			}

			&__timeline {
				position: absolute;
				bottom: 0;
				left: 0;
				display: flex;
				align-items: center;
				width: 100%;
				height: 1rem;
				overflow: hidden;
				cursor: pointer;

				@include viewport-480 {
					position: relative;
					order: 4;
					width: 5rem;
					margin-left: 1.2rem;
				}

				&-background {
					position: absolute;
					bottom: 0;
					width: 100%;
					height: 0.1rem;
					background-color: #737373;
					opacity: 0.8;

					@include viewport-480 {
						bottom: 50%;
						transform: translateY(calc(50% + 0.1rem));
					}
				}

				&-current {
					position: absolute;
					bottom: 0;
					width: 100%;
					height: 0.2rem;
					background-color: $white;
					transform: scaleX(0);
					transform-origin: left;

					@include viewport-480 {
						bottom: 0.35rem;
					}
				}
			}
		}
	}
</style>
