import React from "react";

import { Button, Modal, ButtonClickEvent } from "@fider/components";
import { actions, notify, navigator } from "@fider/services";

interface DangerZoneState {
  clicked: boolean;
}

export class DangerZone extends React.Component<{}, DangerZoneState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      clicked: false
    };
  }

  public onClickDelete = async () => {
    this.setState({ clicked: true });
  };

  public onCancel = async () => {
    this.setState({ clicked: false });
  };

  public onConfirm = async (e: ButtonClickEvent) => {
    const response = await actions.deleteCurrentAccount();
    if (response.ok) {
      e.preventEnable();
      navigator.goHome();
    } else {
      notify.error("Ein Fehler ist aufgetreten. Versuchen Sie es später.");
    }
  };

  public render() {
    return (
      <div className="l-danger-zone">
        <Modal.Window isOpen={this.state.clicked} center={false} onClose={this.onCancel}>
          <Modal.Header>Delete account</Modal.Header>
          <Modal.Content>
            <p>
              Wenn Sie Ihr Konto löschen, werden alle Ihre persönlichen Daten für immer gelöscht.
              Der von Ihnen veröffentlichte Inhalt bleibt erhalten, wird jedoch anonymisiert.
            </p>
            <p>
              Dieser Prozess ist nicht rückgängig zu machen. <strong>Bist du dir sicher?</strong>
            </p>
          </Modal.Content>
          <Modal.Footer>
            <Button color="danger" size="tiny" onClick={this.onConfirm}>
              Bestätigen
            </Button>
            <Button color="cancel" size="tiny" onClick={this.onCancel}>
              Abbrechen
            </Button>
          </Modal.Footer>
        </Modal.Window>

        <h4>Account löschen</h4>
        <p className="info">
              Wenn Sie Ihr Konto löschen, werden alle Ihre persönlichen Daten für immer gelöscht.
              Der von Ihnen veröffentlichte Inhalt bleibt erhalten, wird jedoch anonymisiert.
        </p>
        <p className="info">This process is irreversible. Please be certain.</p>
        <Button color="danger" size="tiny" onClick={this.onClickDelete}>
          Lösche mein Account
        </Button>
      </div>
    );
  }
}
