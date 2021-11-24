<template>
  <div class="container flex footer">
    <a href="https://github.com/MNBoy/nuxt-invoice-app" target="_blank">
      <p>GITHUB</p>
    </a>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: flex-end;

  a {
    text-decoration: none;

    p {
      color: rgba(255, 255, 255, 0.493);
      font-weight: 300;
      cursor: pointer;
    }
  }
}
</style>
