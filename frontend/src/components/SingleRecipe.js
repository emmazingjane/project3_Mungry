import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import RecipesModel from '../models/RecipesModel';


class SingleRecipe extends Component {
  state = {
    post: null,
    query: '',
  }
  componentDidMount() {
    let recipeId = this.props.match.params.recipe_id;
    RecipesModel.findRecipe(recipeId)
    .then(data => {
      // console.log('SingleRecipe by ID: ',data);
      this.setState({
        post: data.data
      });
    });
  }

  handleCommentForm = (event) => {
    let query = event.target.value;
    this.setState({
      query,
    });
    console.log(query);
  }

  onFormSubmit = (event) =>{
    let recipeId = this.props.match.params.recipe_id
    event.preventDefault();
    let content = this.state.query;
    RecipesModel.newComment(recipeId, content)
    .then(newComment=>{
      this.setState({
        post : {
          ...this.state.post,
          comments: this.state.post.comments.concat(newComment.data),
          // comments: [...this.state.post.comments, newComment.data]
        },
        query: '',
      });
    });
    console.log(this.state)
  }

  deleteComment = (comment_id) => {
    let recipeId = this.props.match.params.recipe_id;
    console.log("recipeId ",recipeId);
    console.log("comment_id ", comment_id );
    RecipesModel.commentDestroy(recipeId, comment_id)
    .then(commentUpdate=>{
      console.log(commentUpdate);
      let updatedComments = this.state.post.comments.filter(comment=>{
        return comment._id !== comment_id;
      });
      console.log(updatedComments);
      this.setState({
        post: {
          ...this.state.post, //spread do not change state except (comments)
          comments: updatedComments //comments
        }
      })
    })
  }


  render(){
    let post = this.state.post !== null ? this.state.post : <h2>Loading...</h2>
    console.log(this.state.post)

    let eachComment = this.state.post === null ? <h2>Loading...</h2> : this.state.post.comments.map(comment =>{
      return (
        <div className="comment" key={comment._id}>
          <div className="card">
           <div className="card-body">{ comment.content }<button onClick={()=>this.deleteComment(comment._id)} className="btn-floating btn-small waves-effect waves-light red">x</button>
          </div>
        </div>
      </div>)
    })

    return (
      <div>
        <h4 id=""> {post.title} </h4>
        <img src={post.image_url} alt={post.title}/>
        <div>
        <a className="waves-effect waves-light btn" id="update-btn">Update Recipe</a>
        </div>
        <div className="single-post">
          <div className="ingredients-section">
            <h5>Ingredients:</h5>
            <div className="ingredients">
              <p>{post.ingredients}</p>
            </div>
          </div>
          <h5>Directions:</h5>
          <p className="instructions">{post.directions}</p>
        </div>

        <div className="row">
          <form className="col s12" onSubmit={ this.onFormSubmit }>
            <div className="row">
              <div className="input-field col s6">
                <input onInput={this.handleCommentForm}
                  value={this.state.query}
                  placeholder="Write your comment!"
                  id="comment"
                  type="text"
                  className="validate" />
              </div>
            </div>
              <button className="waves-effect waves-light btn" type="submit" name="action">New Comment</button>
          </form>
        </div>
        { eachComment }
      </div>
    )
  }

}

export default SingleRecipe;
