import { useEffect, useState } from "react";

type ChatScrollProps = {
  chatRef: React.RefObject<HTMLDivElement>;
  bottomRef: React.RefObject<HTMLDivElement>;
  shouldLoadMore: boolean;
  loadMore: () => void;
  count: number;
};

export const useChatScroll = ({
  chatRef,
  bottomRef,
  shouldLoadMore,
  loadMore,
  count,
}: ChatScrollProps) => {
  const [hasInitialized, setHasInitialized] = useState(false);
  const [savedScrollHeight, setSavedScrollHeight] = useState(0);
  const [numFetches, setNumFetches] = useState(0);

  useEffect(() => {
    const topDiv = chatRef?.current;

    const handleScroll = () => {
      const scrollTop = topDiv?.scrollTop;

      if (scrollTop === 0 && shouldLoadMore) {
        setSavedScrollHeight(topDiv?.scrollHeight ?? 0);

        loadMore();

        setNumFetches((prevNumFetches) => (prevNumFetches + 1));
      }
    };

    topDiv?.addEventListener("scroll", handleScroll);

    return () => {
      topDiv?.removeEventListener("scroll", handleScroll);
    }
  }, [shouldLoadMore, loadMore, chatRef]);

  useEffect(() => {
    const bottomDiv = bottomRef?.current;
    const topDiv = chatRef.current;

    const shouldAutoScroll = () => {
      if (!hasInitialized && bottomDiv) {
        setHasInitialized(true);
        return true;
      }

      if (!topDiv) {
        return false;
      }

      const distanceFromBottom = topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight;
      return distanceFromBottom <= 100;
    }

    if (shouldAutoScroll()) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);
    }
    else {
      setTimeout(() => {
        if (topDiv && savedScrollHeight && savedScrollHeight > 0) {
          const scrollPosition: number = topDiv.scrollHeight - savedScrollHeight;
          topDiv.scrollTop = scrollPosition;
          setSavedScrollHeight(0);
        }
      }, 500)
    }
  }, [bottomRef, chatRef, count, hasInitialized, numFetches]);
}