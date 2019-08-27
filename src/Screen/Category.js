import * as React from 'react';

import { connect } from 'react-redux';
import {
    ScrollView,
    View,
    RefreshControl,
    Text,
} from 'react-native';
import {
    Layout,
} from 'react-native-ui-kitten';
import Toast from 'react-native-easy-toast';

import {Header, RenderErrorBlog } from '../Component/';
import {BlogListContainer } from '../Container';

import {fetchBlogs, fetchBlogsCat} from '../Redux/Actions/Blog-actions';


export class CategoryScreen extends React.Component {
    state = {
        loading: false,
        isRefreshing: false,
        hasMore: true,
        filter:{cat:'',page:1,limit:20,q:''},
        title:'',
    }
    toast = null;
  	constructor(props) {
  		super(props);

      this._goToPage = this._goToPage.bind(this);
  	}

    componentDidMount() {
    };
    componentWillMount() {
      const { params } = this.props.navigation.state;
      const filter = this.state.filter;
            filter.cat = params.id;
      this.setState({filter:filter},()=>{
        if(this.props.blogs.length <=0) {
          this.props.fetchBlogsCat(filter);
        }
      });
    };
    componentWillReceiveProps(nextProps) {
      const { params } = nextProps.navigation.state;
      const  paramsOld = this.state.filter;
      if(params.id !== paramsOld.cat) {
        const filter = this.state.filter;
              filter.cat = params.id;
              filter.page = 1;
        this.setState({hasMore:true},()=>{
            if (this.props.blogs.length <=0) {        
              this.setState({filter:filter},this.props.fetchBlogsCat(filter));
            }
        });

      }
    }

    __onRefresh = ()=> {
      this._getDatas();
    }
    _toast = (msg) => {
      this.toast.show(msg, 3000, () => {
         // something you want to do at close
     });
    }
    _getDatas = () => {
      this.setState({isRefreshing: true});
    	this.props.fetchBlogsCat(filter);
    };
    _loadMore = () => {

      if(this.props.blogCount <= this.props.blogs.length) {
        this.setState({hasMore:false});
        return;
      }

      let filter = this.state.filter;
          filter.page = filter.page +1;
      this.setState({filter:filter, loading:true},()=>{
        this.props.fetchBlogsCat(filter);
      });
    };
    _goToPage = (item) => {
        // console.warn(item);
        if(!item.id){
          return;
        }
        this.props.navigation.push('Page', {
            itemId: item.link,
        })
    }

    _isCloseToBottom({
        layoutMeasurement,
        contentOffset,
        contentSize
    }) {
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - 50;
    };
    
    render() {
      const { params } = this.props.navigation.state;
      
      if (this.props.blogError.global){
        return(
          <View>
            <Header navigation = {this.props.navigation} title={params.title} />
            <RenderErrorBlog />
          </View>
        );
      }
      return (
        <Layout style={{paddingBottom:40}}>
            <Header navigation = {this.props.navigation} title={params.title} />
            <BlogListContainer 
              hasMore={this.state.hasMore}
              isRefreshing={this.state.isRefreshing}

              loadMore={this._loadMore}
              onRefresh={this._onRefresh}
              goToPage={this._goToPage}

              blogLoading={this.props.blogLoading}
              hideHeader={(d)=>{}}
              blogError={this.props.blogError}
              blogs={this.props.blogs}
              blogMain={this.props.blogMain}
            />
            <Toast
                opacity={0.5}
                ref={ref => { this.toast = ref; }} />
        </Layout>
      );
    }
}

function mapStateToProps(state, props) {
  return {
      blogs:state.BlogStore.blogsByCat[props.navigation.state.params.id]===undefined?[]:state.BlogStore.blogsByCat[props.navigation.state.params.id],
      blogMain:state.BlogStore.blogMainByCat[props.navigation.state.params.id]===undefined?{}:state.BlogStore.blogMainByCat[props.navigation.state.params.id],
      blogCount:state.BlogStore.blogCountByCat[props.navigation.state.params.id]===undefined?0:state.BlogStore.blogCountByCat[props.navigation.state.params.id],
      blogError: state.BlogStore.blogError,
      blogLoading: state.BlogStore.blogLoading,
  }
}
export default connect(mapStateToProps, {fetchBlogs, fetchBlogsCat})(CategoryScreen);
