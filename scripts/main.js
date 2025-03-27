document.addEventListener("DOMContentLoaded", function () {
  // Initial position
  const initialX = 0;
  const initialY = 0;

  // Target position
  const targetX = 80;
  const targetY = 70;

  // Duration of the animation (in seconds)
  const duration = 1;

  let isDragging = false; // Tracks if a drag action is detected
  let startX = 0; // Initial X position
  let startY = 0; // Initial Y position
  const dragThreshold = 5; // Threshold to distinguish between drag and click

  let isDraggingEnabled = false; // Initially disabled until animation completes
  let isHandlePressTriggered = false; // Prevent handlePress from triggering multiple times
  let initialX2 = targetX; // Initialize variables to store x position
  let initialY2 = targetY; // Initialize variables to store y position

  // Select the hit areas
  const hitArea = document.querySelector(".dragArea");
  const hitArea2 = document.querySelector(".clickArea");

  var p = new Peel("#top-left", {
    corner: Peel.Corners.TOP_LEFT,
  });

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
    // show handle drag and click
    showInteractiveElements();
    // Handle drag functionality
    p.handleDrag(function (evt, x, y) {
      if (!isDraggingEnabled) {
        return; // Stop processing if dragging has been disabled
      }

      // Update the position of the hitArea based on the drag coordinates
      hitArea.style.left = `${x - 70}px`;
      hitArea.style.top = `${y - 50}px`;

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
    // p.handlePress(function (evt) {
    //   console.log("press");
    //   onClick();
    // });
    // Attach drag and click detection to both hit areas
    // Define onClick handlers for each hit area
    function onClickHitArea() {
      console.log("HitArea clicked");
      onClick(); // Call the shared onClick logic
    }

    function onClickHitArea2() {
      console.log("HitArea2 clicked");
      onClick(); // Call the shared onClick logic
    }

    // Reusable function for drag detection
    function addDragAndClickDetection(element, onClick) {
      let startX,
        startY,
        isDragging = false;
      const dragThreshold = 10; // Adjust this threshold as needed for drag detection

      // Add event listeners for both mouse and touch interactions
      element.addEventListener("mousedown", (event) =>
        handleStart(event.clientX, event.clientY)
      );
      element.addEventListener("touchstart", (event) => {
        const touch = event.touches[0];
        handleStart(touch.clientX, touch.clientY);
      });

      element.addEventListener("mousemove", (event) =>
        handleMove(event.clientX, event.clientY)
      );
      element.addEventListener("touchmove", (event) => {
        const touch = event.touches[0];
        handleMove(touch.clientX, touch.clientY);
      });

      element.addEventListener("mouseup", handleEnd);
      element.addEventListener("touchend", handleEnd);

      function handleStart(x, y) {
        isDragging = false; // Reset drag state
        startX = x; // Record the starting X position
        startY = y; // Record the starting Y position
      }

      function handleMove(x, y) {
        const deltaX = Math.abs(x - startX);
        const deltaY = Math.abs(y - startY);

        // Check if movement exceeds the drag threshold
        if (deltaX > dragThreshold || deltaY > dragThreshold) {
          isDragging = true; // Mark as dragging
        }
      }

      function handleEnd() {
        if (!isDragging) {
          console.log(`${element.className} detected click`);
          onClick(); // Perform the desired click action
        } else {
          console.log(`${element.className} detected drag`);
        }
      }
    }

    // Define the shared onClick logic
    function onClick() {
      hideInteractiveElements();
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

            // Reset the flag after the animation is completed
            isHandlePressTriggered = false;
          },
        }
      );
    }

    // Attach drag and click detection to both hit areas
    addDragAndClickDetection(hitArea, onClickHitArea);
    addDragAndClickDetection(hitArea2, onClickHitArea2);

    // hide handle drag and click
    function hideInteractiveElements() {
      gsap.set(".dragArea, .clickArea", {
        display: "none",
      });
    }
    // show handle drag and click
    function showInteractiveElements() {
      gsap.set(".dragArea , .clickArea", {
        display: "block",
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
