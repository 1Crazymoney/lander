import React, {Component} from 'react';

import PropTypes from 'prop-types';

import {OverlayTrigger, Tooltip} from 'react-bootstrap';

import {FormattedHTMLMessage} from 'react-intl';

import {penSvg} from '../../svg';

import {socialAccountTypes as accountTypes} from '../../constants';

const accountLink = (ac) => {
  switch (ac.service) {
    case 'github':
      return `https://github.com/${ac.identifier}`;
    case 'twitter':
      return `https://twitter.com/${ac.identifier}`;
    case 'facebook':
      return `https://facebook.com/${ac.identifier}`;
    case 'instagram':
      return `https://instagram.com/${ac.identifier}`;
    case 'linkedIn':
      return `https://linkedin.com/in/${ac.identifier}`;
    case 'hackerNews':
      return `https://news.ycombinator.com/user?id=${ac.identifier}`;
    default:
      return '';
  }
};

class SocialAccounts extends Component {

  render() {
    const {accounts, editMode} = this.props;

    const sAccounts = {};

    for (let x = 0; x < accountTypes.length; x++) {
      const i = accountTypes[x];
      sAccounts[i.id] = accounts.find(x => x.service === i.id)
    }

    if (editMode) {
      return <div className="social-accounts edit-mode">
        {accountTypes.map((t) => {
          const ac = sAccounts[t.id];

          let toolTip;
          let btn;

          if (ac) {
            toolTip = <Tooltip>{ac.identifier}</Tooltip>;
            btn = <div key={t.id} className="social-button">{t.icon}</div>;
          } else {
            toolTip = <Tooltip><FormattedHTMLMessage id="social-accounts.not-set" values={{n: t.name}}/></Tooltip>;
            btn = <div key={t.id} className="social-button not-set">{t.icon}</div>;
          }

          return <OverlayTrigger
            key={t.id}
            placement="bottom"
            delay={1000}
            overlay={
              toolTip
            }>
            {btn}
          </OverlayTrigger>
        })}

        <div className="edit-btn">{penSvg}</div>
      </div>
    }

    const l = accountTypes.map((t) => {
      const ac = sAccounts[t.id];
      if (ac) {
        return <a key={t.id} target="_blank" rel="noopener noreferrer" href={accountLink(ac)}
                  className="social-button">{t.icon}</a>;
      }
      return null;
    }).filter(x => x !== null);

    if (l.length > 0) {
      return <div className="social-accounts">{l}</div>;
    }

    return null;
  }
}


SocialAccounts.defaultProps = {
  editMode: false,
  accounts: []
};

SocialAccounts.propTypes = {
  intl: PropTypes.instanceOf(Object).isRequired,
  editMode: PropTypes.bool,
  accounts: PropTypes.arrayOf(PropTypes.shape({
    service: PropTypes.string.isRequired,
    identifier: PropTypes.string.isRequired
  }))
};

export default SocialAccounts;