import type { ModalI } from "../../models/modal";
import CloseIcon from "./closeIcon";

type Props = {
  modalInfo: ModalI;
  onClose: () => void;
};

const CalendarModal = ({ modalInfo, onClose }: Props) => {
  return (
    <div className="calender-info-modal">
      <div className="modal-content" onClick={onClose}>
        <div className="close">
          <CloseIcon width={32} height={32} />
        </div>
        <p>
          <span>Tarih:</span> {modalInfo?.date}
        </p>
        <p>
          <span>Personel:</span> {modalInfo?.staff_name}
        </p>
        <p>
          <span>Başlangıç Saati:</span> {modalInfo?.start}
        </p>
        <p>
          <span>Bitiş Saati:</span> <span></span> {modalInfo?.end}
        </p>
      </div>
    </div>
  );
};

export default CalendarModal;
