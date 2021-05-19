import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { message, PageHeader, Button, Modal, List } from "antd";
import { useHistory, Link } from "react-router-dom";
import HLS from "hls.js";
import "./style.scss";

const Stream = ({ match }) => {
  const { title, episode } = match.params;
  const video = useRef(null);
  const [state, setState] = useState(null);
  const [active, setActive] = useState(null);
  const [modal, ModalOpen] = useState(false);
  const location = useHistory();
  const destroy = () => {
    window.hls.stopLoad();
    window.hls.detachMedia();
    window.hls.destroy();
  };

  useEffect(() => {
    if (active) {
      if (HLS.isSupported()) {
        if (window.hls) destroy();
        window.hls = new HLS({ maxBufferSize: 1 });
        window.hls.loadSource(
          `/content/stream/${active.content._id}/master.nez`
        );
        window.hls.attachMedia(video.current);
      } else if (video.current.canPlayType("application/vnd.apple.mpegurl")) {
        video.current.src = `/content/stream/${active.content._id}/mobile.m3u8`;
      } else {
        message.error("Not Supported Device");
      }
    }
  }, [active]);

  useEffect(() => {
    axios
      .get(`/api/content/title/${title}/${episode}`)
      .then((response) => {
        if (response.data.status) {
          setState(response.data.data);
          setActive(
            response.data.data.episodes.find((active) => active._id === episode)
          );
        }
      })
      .catch((err) => {
        if (err.response.data) {
          return message.error(err.response.data.msg);
        }
      });
  }, [title, episode]);
  return (
    <>
      <div id="stream">
        <PageHeader
          className="site-page-header"
          onBack={() => location.push(`/titles/${title}`)}
          title={state?.name}
          subTitle={active?.name}
          extra={
            state?.episodes.length > 1 ? (
              <Button key="episodes" onClick={() => ModalOpen(true)}>
                Ангиуд
              </Button>
            ) : null
          }
        />
        <video
          controls
          ref={video}
          poster={state && active ? active.content.thumbnail.original : null}
        ></video>
      </div>
      <Modal
        visible={modal}
        footer={null}
        onCancel={() => ModalOpen(false)}
        className="episodes-modal"
      >
        <List
          itemLayout="horizontal"
          dataSource={state?.episodes}
          renderItem={(item, index) => (
            <List.Item>
              <List.Item.Meta
                title={
                  <Link
                    to={`/stream/${title}/${item._id}`}
                    onClick={() => ModalOpen(false)}
                  >
                    {index + 1}. {item.name}
                  </Link>
                }
                description={item.plot}
              />
            </List.Item>
          )}
        ></List>
      </Modal>
    </>
  );
};
export default Stream;
