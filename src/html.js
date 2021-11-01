import React from "react"
import PropTypes from "prop-types"

export default function HTML(props) {
  return (
    <html {...props.htmlAttributes}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        {props.headComponents}
      </head>
      <body {...props.bodyAttributes}>
        {props.preBodyComponents}
        <div
          key={`body`}
          id="___gatsby"
          dangerouslySetInnerHTML={{ __html: props.body }}
        />
        {props.postBodyComponents}
        <script
          dangerouslySetInnerHTML={{
            __html: `
                function onYouTubeIframeAPIReady() {
                  var player;
                  player = new YT.Player('embeddable', {
                    videoId: '34KPVZWE5Ks', // YouTube Video ID
                    width: window.innerWidth,  // Player width (in px)
                    // height: 316,            // Player height (in px)
                    playerVars: {
                      autoplay: 1,          // Auto-play the video on load
                      controls: 0,          // Hide pause/play buttons in player
                      showinfo: 0,          // Hide the video title
                      modestbranding: 1,    // Hide the Youtube Logo
                      loop: 1,              // Run the video in a loop
                      fs: 0,                // Hide the full screen button
                      cc_load_policy: 0,    // Hide closed captions
                      iv_load_policy: 3,    // Hide the Video Annotations
                      autohide: 0           // Hide video controls when playing
                    },
                    events: {
                      onReady: function(e) {
                        e.target.mute();
                      },
                      onStateChange: function(e) {
                        if (e.data === 0) 
                          e.target.playVideo();
                      }
                    }
                  });
                }
            `,
          }}
        />
      </body>
    </html>
  )
}

HTML.propTypes = {
  htmlAttributes: PropTypes.object,
  headComponents: PropTypes.array,
  bodyAttributes: PropTypes.object,
  preBodyComponents: PropTypes.array,
  body: PropTypes.string,
  postBodyComponents: PropTypes.array,
}
