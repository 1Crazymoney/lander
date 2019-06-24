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
      data: null
    }
  }

  componentDidMount() {

    if (window.__p) {
      this.setState({data: window.__p, loading: false});
      return;
    }

    this.fetch().then(data => {
      if (!data) {
        this.setState({notFound: true});
        return;
      }

      this.setState({data});
    }).then(() => {
      this.setState({loading: false});
    })
  }

  fetch = async () => {
    const {match} = this.props;
    const {username} = match.params;

    let data;

    try {
      const fileUrl = await blockStack.getUserAppFileUrl(publishedFile, username, getBaseUrl());
      data = await axios.get(fileUrl).then(x => x.data);
    } catch (e) {
      return false;
    }

    return data;
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

    const {data} = this.state;

    return <div className="main-wrapper-profile">
      <ProfileBg bg={data.bg}/>
      <div className="inner-wrapper">
        <div className="profile-box">
          <ProfilePhoto imageUrl={data.photo} {...this.props}/>
          <ProfileName name={data.name} {...this.props}/>
          <ProfileDescription description={data.description} {...this.props}/>
          <ProfileBio bio={data.bio} {...this.props}/>
          <SocialAccounts accounts={data.accounts} {...this.props}/>
          <WalletAccounts accounts={data.wallets} {...this.props}/>
        </div>
      </div>
    </div>
  }
}


export default ProfilePage;