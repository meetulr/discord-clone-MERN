import qs from "query-string";
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

import { ChannelObject, ConversationObject } from "@/lib/object-types"

interface ServerContentQueryProps {
  paramKey: "channelId" | "conversationId";
  paramValue: string;
  currContent: ChannelObject | ConversationObject;
  serverId: string;
}

export const useServerContentQuery = ({
  paramKey,
  paramValue,
  currContent,
  serverId
}: ServerContentQueryProps) => {
  const content = (paramKey === "channelId" ? "channels" : "conversations");

  const fetchCurrentServer = async () => {
    const url = qs.stringifyUrl({
      url: `/api/${content}/${paramValue}`,
      query: {
        serverId
      }
    });

    const res = await axios.get(url) ?? {};
    return res.data;
  }

  const { data: fetchedContent } = useQuery({
    queryKey: ["getCurrentServerContent"],
    queryFn: fetchCurrentServer,
    initialData: currContent,
    refetchInterval: 5000
  })

  return {
    fetchedContent
  }
}
