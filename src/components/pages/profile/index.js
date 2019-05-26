import React, {Component} from 'react';

import * as axios from 'axios';
import * as blockStack from 'blockstack';

import {publishedFile} from '../../../constants';

import getBaseUrl from '../../../utils/get-base-url';

import ProfileBg from '../../profile-bg';
import ProfilePhoto from '../../profile-photo';
import ProfileName from '../../profile-name';
import ProfileDescription from '../../profile-description';
import ProfileBio from '../../profile-bio';
import SocialAccounts from '../../social-accounts';
import WalletAccounts from '../../wallet-accounts';
import Spinner from '../../elements/spinner';


class ProfilePage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      notFound: false,
      user: null
    }
  }

  componentDidMount() {
    this.fetch().then(resp => {
      if (resp === false) {
        this.setState({notFound: true});
        return;
      }

      this.setState({user: resp});
    }).then(() => {
      this.setState({loading: false});
    })
  }

  fetch = async () => {
    const {match} = this.props;
    const {username} = match.params;

    let profile;
    let published;

    try {
      profile = await blockStack.lookupProfile(username);
      const fileUrl = await blockStack.getUserAppFileUrl(publishedFile, username, getBaseUrl());
      published = await axios.get(fileUrl).then(x => x.data);
    } catch (e) {
      return false;
    }

    if (published === '') {
      return false;
    }

    return {profile, published};
  };

  render() {
    const {loading, notFound} = this.state;
    const {location} = this.props;

    if (loading) {
      return <Spinner/>;
    }

    if (notFound) {
      return <div className="not-found-error">
        <h1>404</h1>
        <strong>{location.pathname} not found</strong>
      </div>;
    }

    const {user} = this.state;
    const {published} = user;

    return <div className="main-wrapper-profile">
      <ProfileBg bg={published.bg}/>
      <div className="inner-wrapper">
        <div className="profile-box">
          <ProfilePhoto imageUrl={published.photo} {...this.props}/>
          <ProfileName name={published.name} {...this.props}/>
          <ProfileDescription description={published.description} {...this.props}/>
          <ProfileBio bio={published.bio} {...this.props}/>
          <SocialAccounts accounts={published.accounts} {...this.props}/>
          <WalletAccounts accounts={published.wallets} {...this.props}/>
        </div>
      </div>
    </div>
  }
}


export default ProfilePage;