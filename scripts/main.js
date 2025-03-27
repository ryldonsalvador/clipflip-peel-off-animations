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
  const hitArea = document.querySelector(".dragArea");
  const hitArea2 = document.querySelector(".clickArea");

  let isDraggingEnabled = false; // Initially disabled until animation completes
  let isHandlePressTriggered = false; // Prevent handlePress from triggering multiple times
  let initialX2 = targetX; // Initialize variables to store x position
  let initialY2 = targetY; // Initialize variables to store y position

  // GSAP animation intro
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
        console.log("Intro animation completed!");

        // Enable dragging and pressing after the intro animation
        isDraggingEnabled = true;
        initializeHandlers();
      },
    }
  );

  // Function to initialize handleDrag and handlePress
  function initializeHandlers() {
    // Handle drag functionality
    p.handleDrag(function (evt, x, y) {
      if (!isDraggingEnabled) {
        return; // Stop processing if dragging has been disabled
      }

      // Update the position of the hitArea based on the drag coordinates
      hitArea.style.left = `${x - 30}px`;
      hitArea.style.top = `${y - 30}px`;

      initialX2 = x; // Update initialX2 dynamically
      initialY2 = y; // Update initialY2 dynamically
      p.setPeelPosition(x, y); // Use x and y in the method

      if (p.getAmountClipped() >= 0.2) {
        hideInteractiveElements();
        isDraggingEnabled = false;
        p.removeEvents();
        p.handleDrag = function () {}; // Overwrite the drag function to disable it

        gsap.to(
          { x: initialX2, y: initialY2 },
          {
            x: 1300,
            y: 400,
            duration: 1,
            ease: "power1.inOut",
            onUpdate: function () {
              const { x, y } = this.targets()[0];
              p.setPeelPosition(x, y); // Update the position during the animation
            },
            onComplete: function () {
              p.setPeelPosition(1300, 400);
              console.log("Drag animation completed!");
              gsap.set(
                ".peel-top, .peel-bottom-shadow, .peel-back, .peel-top-shadow",
                {
                  display: "none",
                }
              );
            },
          }
        );
      }
    }, hitArea);

    // Handle press functionality
    p.handlePress(function (evt) {
      console.log("press");
      onClick();
    });

    // Add a click event listener
    hitArea2.addEventListener("click", function (event) {
      // Perform an action on click
      console.log("click");
      onClick();
      hideInteractiveElements();
    });

    function onClick() {
      if (isHandlePressTriggered) {
        return; // Exit if handlePress was already triggered
      }

      isHandlePressTriggered = true; // Set the flag to true to prevent re-triggering
      // Create the GSAP tween dynamically on press to use the updated x and y
      gsap.to(
        { x: initialX2, y: initialY2 }, // Use the latest values of initialX2 and initialY2
        {
          x: 1300,
          y: 400,
          duration: 1.5,
          ease: "power1.inOut",
          onUpdate: function () {
            const { x, y } = this.targets()[0];
            p.setPeelPosition(x, y); // Update the position during the animation
          },
          onComplete: function () {
            p.setPeelPosition(1300, 400);
            console.log("Press animation completed!");
            gsap.set(
              ".peel-top, .peel-bottom-shadow, .peel-back, .peel-top-shadow",
              {
                display: "none",
              }
            );
          },
        }
      );
    }

    function hideInteractiveElements() {
      gsap.set(".dragArea, .clickArea", {
        display: "none",
      });
    }
  }

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
