import { useQuery } from "@tanstack/react-query"
import axios from "axios"

import { ServerObject } from "@/lib/object-types"

interface ServerQueryProps {
  currServer: ServerObject
}

export const useServerQuery = ({
  currServer
}: ServerQueryProps) => {
  const fetchCurrentServer = async () => {
    const res = await axios.get(`/api/servers/${currServer._id}`) ?? {};
    return res.data;
  }

  const { data: fetchedServer, isPending } = useQuery({
    queryKey: ["getCurrentServer"],
    queryFn: fetchCurrentServer,
    initialData: currServer,
    refetchInterval: 5000
  })

  return {
    fetchedServer,
    isPending
  }
}
