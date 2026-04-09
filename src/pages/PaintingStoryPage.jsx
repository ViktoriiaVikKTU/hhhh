import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./PaintingStoryPage.css";
import DiscoverButton from "../components/DiscoverButton";

function PaintingStoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [painting, setPainting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [heroProgress, setHeroProgress] = useState(0);
  const [detailsProgress, setDetailsProgress] = useState(0);

  const [imageNaturalSize, setImageNaturalSize] = useState({
    width: 1,
    height: 1,
  });

  const [detailsBaseRenderedSize, setDetailsBaseRenderedSize] = useState({
    width: 1,
    height: 1,
  });

  const detailsImageRef = useRef(null);
  const detailsContainerRef = useRef(null);

  useEffect(() => {
    if (!id) {
      setError("No painting id in URL.");
      setLoading(false);
      return;
    }

    fetch(
      `http://museum-cms.local/wp-json/wp/v2/paintings/${id}?acf_format=standard`
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("Painting not found");
        }
        return res.json();
      })
      .then((data) => {
        setPainting(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching painting:", err);
        setError("Painting not found.");
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.querySelector(".painting-journey");
      if (heroSection) {
        const rect = heroSection.getBoundingClientRect();
        const total = heroSection.offsetHeight - window.innerHeight;
        const passed = Math.min(Math.max(-rect.top, 0), total);
        const nextProgress = total > 0 ? passed / total : 0;
        setHeroProgress(nextProgress);
      }

      const detailsSection = document.querySelector(".painting-details-journey");
      if (detailsSection) {
        const rect = detailsSection.getBoundingClientRect();
        const total = detailsSection.offsetHeight - window.innerHeight;
        const passed = Math.min(Math.max(-rect.top, 0), total);
        const nextProgress = total > 0 ? passed / total : 0;
        setDetailsProgress(nextProgress);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  useEffect(() => {
    const updateRenderedSize = () => {
      if (detailsContainerRef.current) {
        setDetailsBaseRenderedSize({
          width: detailsContainerRef.current.clientWidth || 1,
          height: detailsContainerRef.current.clientHeight || 1,
        });
      }
    };

    updateRenderedSize();
    window.addEventListener("resize", updateRenderedSize);

    return () => window.removeEventListener("resize", updateRenderedSize);
  }, [painting]);

  const title = useMemo(
    () => painting?.title?.rendered || "Untitled painting",
    [painting]
  );

  const artist = useMemo(
    () => painting?.acf?.artist || "Unknown artist",
    [painting]
  );

  const introText = useMemo(
    () => painting?.acf?.intro_text || "",
    [painting]
  );

  const historyLostText = useMemo(
    () => painting?.acf?.history_lost_text || "",
    [painting]
  );

  const detail1Text = useMemo(
    () => painting?.acf?.detail_1_text || "",
    [painting]
  );
  const detail1XPx = useMemo(
    () => Number(painting?.acf?.detail_1_x_px || 0),
    [painting]
  );
  const detail1YPx = useMemo(
    () => Number(painting?.acf?.detail_1_y_px || 0),
    [painting]
  );

  const detail2Text = useMemo(
    () => painting?.acf?.detail_2_text || "",
    [painting]
  );
  const detail2XPx = useMemo(
    () => Number(painting?.acf?.detail_2_x_px || 0),
    [painting]
  );
  const detail2YPx = useMemo(
    () => Number(painting?.acf?.detail_2_y_px || 0),
    [painting]
  );

  const detail3Text = useMemo(
    () => painting?.acf?.detail_3_text || "",
    [painting]
  );
  const detail3XPx = useMemo(
    () => Number(painting?.acf?.detail_3_x_px || 0),
    [painting]
  );
  const detail3YPx = useMemo(
    () => Number(painting?.acf?.detail_3_y_px || 0),
    [painting]
  );

  const imageSrc = useMemo(() => {
    const image = painting?.acf?.image;

    if (!image) return "";
    if (typeof image === "string") return image;
    if (typeof image === "object" && image.url) return image.url;

    return "";
  }, [painting]);

  const handleDetailImageLoad = (e) => {
    setImageNaturalSize({
      width: e.target.naturalWidth || 1,
      height: e.target.naturalHeight || 1,
    });

    if (detailsContainerRef.current) {
      setDetailsBaseRenderedSize({
        width: detailsContainerRef.current.clientWidth || 1,
        height: detailsContainerRef.current.clientHeight || 1,
      });
    }
  };

  const details = useMemo(() => {
    const raw = [
      { id: 1, text: detail1Text, xPx: detail1XPx, yPx: detail1YPx },
      { id: 2, text: detail2Text, xPx: detail2XPx, yPx: detail2YPx },
      { id: 3, text: detail3Text, xPx: detail3XPx, yPx: detail3YPx },
    ];

    return raw
      .filter(
        (item) =>
          item.text &&
          imageNaturalSize.width > 0 &&
          imageNaturalSize.height > 0
      )
      .map((item) => ({
        id: item.id,
        text: item.text,
        xPercent: (item.xPx / imageNaturalSize.width) * 100,
        yPercent: (item.yPx / imageNaturalSize.height) * 100,
      }));
  }, [
    detail1Text,
    detail1XPx,
    detail1YPx,
    detail2Text,
    detail2XPx,
    detail2YPx,
    detail3Text,
    detail3XPx,
    detail3YPx,
    imageNaturalSize,
  ]);

  const lerp = (a, b, t) => a + (b - a) * t;

  const scalePhaseEnd = 0.45;

  let scale = 1;
  let translateY = 0;
  let textOpacity = 1;

  if (heroProgress <= scalePhaseEnd) {
    const p = heroProgress / scalePhaseEnd;
    scale = 1 + p * 1.25;
    textOpacity = 1 - p * 1.15;
  } else {
    scale = 2.25;
    textOpacity = 0;

    const moveProgress = (heroProgress - scalePhaseEnd) / (1 - scalePhaseEnd);
    translateY = -moveProgress * 55;
  }

  const detailCount = details.length;

  const scaledProgress =
    detailCount > 0 ? detailsProgress * Math.max(detailCount, 1) : 0;

  const currentIndex =
    detailCount > 0
      ? Math.min(detailCount - 1, Math.floor(scaledProgress))
      : 0;

  const nextIndex =
    detailCount > 0
      ? Math.min(detailCount - 1, currentIndex + 1)
      : 0;

  const localProgress =
    detailCount > 0 ? Math.min(1, Math.max(0, scaledProgress - currentIndex)) : 0;

  const currentDetail = detailCount > 0 ? details[currentIndex] : null;
  const nextDetail = detailCount > 0 ? details[nextIndex] : null;

  const spotX =
    currentDetail && nextDetail
      ? lerp(currentDetail.xPercent, nextDetail.xPercent, localProgress)
      : 50;

  const spotY =
    currentDetail && nextDetail
      ? lerp(currentDetail.yPercent, nextDetail.yPercent, localProgress)
      : 50;

  const activeDetailText = currentDetail?.text || "";

  const imageZoom = 1.14 + detailsProgress * 0.32;

  const displayedImageWidth = detailsBaseRenderedSize.width * imageZoom;
  const displayedImageHeight = detailsBaseRenderedSize.height * imageZoom;

  const imageOffsetX = (spotX / 100) * displayedImageWidth;
  const imageOffsetY = (spotY / 100) * displayedImageHeight;

  if (loading) {
    return <div className="painting-story-loading">Loading...</div>;
  }

  if (error) {
    return <div className="painting-story-error">{error}</div>;
  }

  return (
    <div className="painting-story-page">
      {/* ── Hero / intro journey ─────────────────────────────────────────── */}
      <div className="painting-journey">
        <div className="painting-journey__sticky">
          <div
            className="painting-journey__image-wrap"
            style={{
              transform: `scale(${scale}) translateY(${translateY}%)`,
            }}
          >
            {imageSrc && (
              <img
                className="painting-journey__image"
                src={imageSrc}
                alt={title}
              />
            )}
          </div>

          <div
            className="painting-journey__text"
            style={{ opacity: textOpacity }}
          >
            <h1 className="painting-journey__title">{title}</h1>
            <p className="painting-journey__artist">{artist}</p>
            {introText && (
              <p className="painting-journey__intro">{introText}</p>
            )}
          </div>
        </div>
      </div>

      {/* ── Detail spotlight journey ─────────────────────────────────────── */}
      {details.length > 0 && (
        <div className="painting-details-journey">
          <div className="painting-details-journey__sticky">
            <div className="painting-details-journey__image-container" ref={detailsContainerRef}>
              <img
                ref={detailsImageRef}
                className="painting-details-journey__image"
                src={imageSrc}
                alt={title}
                onLoad={handleDetailImageLoad}
                style={{
                  width: displayedImageWidth,
                  height: displayedImageHeight,
                  transform: `translate(${
                    -imageOffsetX + detailsBaseRenderedSize.width / 2
                  }px, ${
                    -imageOffsetY + detailsBaseRenderedSize.height / 2
                  }px)`,
                }}
              />
              <div
                className="painting-details-journey__spotlight"
                style={{ left: "50%", top: "50%" }}
              />
            </div>

            {activeDetailText && (
              <p className="painting-details-journey__detail-text">
                {activeDetailText}
              </p>
            )}
          </div>
        </div>
      )}

      {/* ── History / last section ───────────────────────────────────────── */}
      <div className="painting-history-section">
        <div className="painting-history-section__content">
          {historyLostText && (
            <p className="painting-history-section__text">{historyLostText}</p>
          )}
          <DiscoverButton onClick={() => navigate(-1)} />
        </div>
      </div>
    </div>
  );
}

export default PaintingStoryPage;
