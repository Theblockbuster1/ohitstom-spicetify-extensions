// NAME: Quick Queue
// AUTHOR: OhItsTom
// DESCRIPTION: Adds a button to the tracklist to add/remove a song from the queue.
// TODO: complete logic + prevent pileups

(function quickQueue() {
	if (
		!(
			Spicetify.React &&
			Spicetify.ReactDOM &&
			Spicetify.SVGIcons &&
			Spicetify.showNotification &&
			Spicetify.Platform.PlayerAPI &&
			Spicetify.Tippy &&
			Spicetify.TippyProps
		)
	) {
		setTimeout(quickQueue, 10);
		return;
	}

	const QueueButton = Spicetify.React.memo(({ uri, tippy }) => {
		const [isQueued, setIsQueued] = Spicetify.React.useState(Spicetify.Platform.PlayerAPI.getQueue().queued.some(item => item.uri === uri));

		Spicetify.React.useEffect(() => {
			//Spicetify.Platform.PlayerAPI._queue._events.addListener("queue_update", e => console.debug(uri, "signal receive"));
			return function cleanup() {
				console.debug("exit");
			};
		}, [uri, tippy]);

		// Initialize
		tippy.setProps({ content: isQueued ? "Remove from queue" : "Add to queue" });

		// Functions
		const handleClick = function () {
			Spicetify.showNotification(isQueued ? "Removed from queue" : "Added to queue");
			Spicetify.Platform.PlayerAPI[isQueued ? "removeFromQueue" : "addToQueue"]([{ uri: uri }]);
			tippy.setProps({ content: isQueued ? "Remove from queue" : "Add to queue" });
			setIsQueued(!isQueued);
		};

		// Render
		return Spicetify.React.createElement(
			"button",
			{
				className:
					"Button-sm-16-buttonTertiary-iconOnly-isUsingKeyboard-useBrowserDefaultFocusStyle Button-textSubdued-small-small-buttonTertiary-iconOnly-condensed-isUsingKeyboard-useBrowserDefaultFocusStyle main-trackList-rowHeartButton",
				"aria-checked": false,
				onClick: handleClick,
				style: { marginRight: "8px" }
			},
			Spicetify.React.createElement(
				"span",
				{ className: "Wrapper-sm-only Wrapper-small-only" },
				Spicetify.React.createElement(
					"svg",
					{
						role: "img",
						height: "16",
						width: "16",
						viewBox: "0 0 16 16",
						className: "Svg-img-icon-small"
					},
					Spicetify.React.createElement("svg", {
						dangerouslySetInnerHTML: {
							__html: isQueued
								? `<path d="M5.25 3v-.917C5.25.933 6.183 0 7.333 0h1.334c1.15 0 2.083.933 2.083 2.083V3h4.75v1.5h-.972l-1.257 9.544A2.25 2.25 0 0 1 11.041 16H4.96a2.25 2.25 0 0 1-2.23-1.956L1.472 4.5H.5V3h4.75zm1.5-.917V3h2.5v-.917a.583.583 0 0 0-.583-.583H7.333a.583.583 0 0 0-.583.583zM2.986 4.5l1.23 9.348a.75.75 0 0 0 .744.652h6.08a.75.75 0 0 0 .744-.652L13.015 4.5H2.985z"></path>`
								: `<path d="M16 15H2v-1.5h14V15zm0-4.5H2V9h14v1.5zm-8.034-6A5.484 5.484 0 0 1 7.187 6H13.5a2.5 2.5 0 0 0 0-5H7.966c.159.474.255.978.278 1.5H13.5a1 1 0 1 1 0 2H7.966zM2 2V0h1.5v2h2v1.5h-2v2H2v-2H0V2h2z"></path>`
						}
					})
				)
			)
		);
	});

	function findVal(object, key, max = 10) {
		if (object[key] !== undefined || !max) {
			return object[key];
		}

		for (const k in object) {
			if (object[k] && typeof object[k] === "object") {
				const value = findVal(object[k], key, --max);
				if (value !== undefined) {
					return value;
				}
			}
		}

		return undefined;
	}

	const observer = new MutationObserver(function (mutationList) {
		mutationList.forEach(mutation => {
			const node = mutation.addedNodes[0];
			if (node?.attributes?.role?.value === "row") {
				const lastRowSection = node.firstChild.lastChild;
				const heartButton = lastRowSection.firstChild;
				if (heartButton && heartButton.classList.contains("main-trackList-rowHeartButton")) {
					const reactProps = Object.keys(node).find(k => k.startsWith("__reactProps$"));
					const uri = findVal(node[reactProps], "uri");

					const queueButtonWrapper = document.createElement("div");
					queueButtonWrapper.className = "queueControl-wrapper";
					queueButtonWrapper.style.marginRight = 0;

					const queueButtonElement = lastRowSection.insertBefore(queueButtonWrapper, heartButton);
					const tippy = Spicetify.Tippy(queueButtonElement, {
						...Spicetify.TippyProps,
						hideOnClick: true
					});
					Spicetify.ReactDOM.render(Spicetify.React.createElement(QueueButton, { uri: uri, tippy: tippy }), queueButtonElement);
				}
			}
		});
	});

	observer.observe(document, {
		subtree: true,
		childList: true
	});
})();
