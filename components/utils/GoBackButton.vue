<template>
	<button class="GoBackButton"
		@click="goBack()">Back</button>
</template>

<script setup>
	const router = useRouter()

	function goBack() {
		router.go(-1)
	}
</script>

<style lang="scss">
.GoBackButton {
  cursor: pointer;
  text-decoration: underline;
  text-decoration-thickness: from-font;
  text-underline-offset: 0.5rem;

  @include viewport-480 {
    position: fixed;
    width: 100%;
    height: 4rem;
    bottom: 0;
    left: 0;
    background-color: $black;
    border-top: .1rem solid $medium-grey;
    color: $medium-grey;
    text-align: left;
    padding: 1rem;
    line-height: 1;
  }
}
</style>
