import React, { useEffect, ReactElement, useState } from "react";

import { EntityProps } from "./Entity";
import Image from "../../Cards/Image";

function Camera(props: EntityProps): ReactElement | null {
  const [url, setUrl] = useState<string>();

  useEffect(() => {
    if (props.hassAuth && props.entity.attributes)
      setUrl(
        `${props.hassAuth.data.hassUrl}${
          props.entity.attributes.entity_picture
        }&${new Date().toISOString().slice(-13, -5)}`
      );
  }, [props.hassAuth, props.entity.attributes]);

  return <Image {...props} card={{ ...props.card, url }} />;
}

export default Camera;
