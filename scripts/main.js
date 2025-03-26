document.addEventListener("DOMContentLoaded", function () {
  // Initial position
  const initialX = 0;
  const initialY = 0;

  // Target position
  const targetX = 80;
  const targetY = 70;

  // Duration of the animation (in seconds)
  const duration = 1;

  var p = new Peel("#top-left", {
    corner: Peel.Corners.TOP_LEFT,
  });
  //   p.setFadeThreshold(0.7);
  p.handleDrag(function (evt, x, y) {
    this.setPeelPosition(x, y);
    if (p.getAmountClipped() === 1) {
      p.removeEvents();
      console.log("remove events");
      gsap.set(".peel-top, .peel-bottom-shadow, .peel-back, .peel-top-shadow", {
        display: "none",
      });
    }
  });

  // GSAP animation
  gsap.to(
    { x: initialX, y: initialY },
    {
      x: targetX,
      y: targetY,
      duration: duration,
      ease: "power1.inOut",
      repeat: 2, // Loop the animation 2 times
      yoyo: true, // Makes the animation reverse direction for each loop
      onUpdate: function () {
        const { x, y } = this.targets()[0];
        p.setPeelPosition(x, y); // Update the position during the animation
      },
      onComplete: function () {
        // Ensure final position is set to targetX and targetY after loops
        p.setPeelPosition(targetX, targetY);
        console.log("Animation completed after 2 loops!");
      },
    }
  );

  var splide = new Splide(".image-carousels", {
    pagination: true,
    arrows: false,
    easing: "ease-out",
    drag: true,
    perPage: 1,
    perMove: 1,
  });
  splide.mount();
});
