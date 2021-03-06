import React, {Component} from 'react';

import PropTypes from 'prop-types';

import EditBtn from '../elements/edit-btn';

import {accountTypes} from '../../wallet';

class WalletAccounts extends Component {

  edit = () => {
    const {toggleUiProp} = this.props;

    if (toggleUiProp) {
      toggleUiProp('walletEdit');
    }
  };

  render() {

    const {accounts, editMode} = this.props;
    const wAccounts = {};
    const userHasAny = !!accountTypes.find(x => accounts[x.id]);

    for (let x = 0; x < accountTypes.length; x++) {
      const i = accountTypes[x];
      wAccounts[i.id] = accounts[i.id];
    }


    if (editMode) {
      if (!userHasAny) {
        return null;
      }

      return <div className="wallet-accounts edit-mode">
        <EditBtn {...this.props} onClick={this.edit}/>

        {accountTypes.map((t) => {
          const ac = wAccounts[t.id];

          if (!ac) {
            return null;
          }

          return <div key={t.id} className="wallet-account">
            <div className="icon">{t.icon}</div>
            <div className="address">
              {ac}
            </div>
          </div>
        })}
      </div>;
    }

    const l = accountTypes.map((t) => {
      const ac = wAccounts[t.id];
      if (ac) {
        return <div key={t.id} className="wallet-account">
          <div className="icon">{t.icon}</div>
          <div className="address">{ac}</div>
        </div>;
      }
      return null;
    }).filter(x => x !== null);

    if (l.length > 0) {
      return <div className="wallet-accounts">{l}</div>;
    }

    return <div className="wallet-sep"/>;
  }
}


WalletAccounts.defaultProps = {
  editMode: false,
  accounts: {}
};

WalletAccounts.propTypes = {
  editMode: PropTypes.bool,
  accounts: PropTypes.instanceOf(Object)
};

export default WalletAccounts;
