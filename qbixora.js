//  -------------------------------------------------------------
//  author        Giga
//  project       qeeqbox/ixora
//  email         gigaqeeq@gmail.com
//  description   app.py (CLI)
//  -------------------------------------------------------------
//  contributors list qeeqbox/ixora/graphs/contributors
//  -------------------------------------------------------------

var ejs  = require('ejs');
var fs   = require('fs');
var open = require('open');
var path = require('path')

class QBIxora {
  constructor(project_name,verbose=false) {
    this.project_name = project_name
    this.verbose = verbose;
    this.graph = {
      'nodes': [],
      'links': [],
      'search_input': [],
      'search_index': []
    }
    this.temp_nodes = []
    this.temp_edges = []
    this.base_html_file = fs.readFileSync(path.join(__dirname,'graph_js.html'), 'utf-8');
    this.base_html = ejs.render ( this.base_html_file , {project_name:this.project_name});
  }

  add_node(name, search = undefined, _set = undefined) {
    try{
      if (this.temp_nodes.length < 3000){
        if (typeof name !== 'undefined' && name !== null && !this.temp_nodes.includes(name)) {
          this.temp_nodes.push(name)
          var temp_node = {
            "name": name,
            '_id': this.graph['nodes'].length
          }
          if (typeof _set !== 'undefined' && _set !== null) {
            temp_node = Object.assign({}, _set, temp_node)
          }
          this.graph['nodes'].push(temp_node)
        }
        if (typeof search !== 'undefined' && search !== null && !this.graph['search_input'].includes(search)) {
          this.graph['search_input'].push(search)
          this.graph['search_index'].push(this.temp_nodes.indexOf(name))
        }
      }
    }
    catch (err){
      this.verbose && console.log(err);
    }
  }

  add_edge(src, dst, _set = undefined) {
    var src_dst = src + ":" + dst
    var dst_src = dst + ":" + src
    if (typeof src_dst !== 'undefined' && src_dst !== null && !this.temp_edges.includes(src_dst) && typeof dst_src !== 'undefined' && dst_src !== null && !this.temp_edges.includes(dst_src))
      try {
        var _src = this.temp_nodes.indexOf(src)
        var _dst = this.temp_nodes.indexOf(dst)
        if (_src != -1 && _dst != -1) {
          this.temp_edges.push(src_dst)
          var temp_edge = {
            "source": _src,
            "target": _dst
          }
          if (typeof _set !== 'undefined' && _set !== null) {
            temp_edge = Object.assign({}, _set, temp_edge)
          }

          this.graph['links'].push(temp_edge)
        }
      }
      catch (err){
        this.verbose && console.log(err);
      }
  }
  create_graph(div,window_title="",search_title="",search_msg="", copyright_link="",copyright_msg="",tools=[], collide=10,distance=100,data={},method="",save_to=undefined,open_file=false)
  {

    var current_subject = false;
    var right_click_node = undefined
    var override_defualt_node_color = undefined
    var override_defualt_link_color = undefined
    var defualt_node_color = '#D4D4D4'
    var defualt_edge_color = '#b2b2b2'
    var search_on_off_rendered= (tools.includes('search')  ? true : false);
    var tooltop_on_off_rendered = (tools.includes('tooltip')  ? true : false);
    var window_on_off_rendered = (tools.includes('window')  ? true : false);
    var search_title_rendered = search_title
    var search_msg_rendered = search_msg
    var tools_rendered = tools
    var collide_rendered = collide
    var distance_rendered = distance
    var copyright_link_rendered = copyright_link
    var copyright_msg_rendered = copyright_msg

    try{
      if (Object.keys(data).length !== 0){
        this.graph = data
      }

      var ixora_object = {graph_div:div,graph:this.graph,current_subject:current_subject,right_click_node:right_click_node,override_defualt_node_color:override_defualt_node_color,override_defualt_link_color:override_defualt_link_color,defualt_node_color:defualt_node_color,defualt_edge_color:defualt_edge_color,search_on_off_rendered:search_on_off_rendered,tooltop_on_off_rendered:tooltop_on_off_rendered,search_title_rendered:search_title_rendered,search_msg_rendered:search_msg_rendered,tools_rendered:tools_rendered,window_on_off_rendered:window_on_off_rendered,collide_rendered:collide_rendered,distance_rendered:distance_rendered,copyright_link_rendered:copyright_link_rendered,copyright_msg_rendered:copyright_msg_rendered}

      if (method == 'object'){
        return ixora_object
      }
      else{
        var template = fs.readFileSync('template_js.html', 'utf-8');
        var rendered = ejs.render ( template , {ixora_object:ixora_object});
        if (typeof save_to !== 'undefined' && save_to !== null && rendered != ""){
            fs.writeFileSync(save_to, rendered, 'utf8');
            if (open_file){
                open(save_to);
            }
        }
        else{
          return rendered
        }
      }
    }
    catch (err){
      this.verbose && console.log(err);
    }

    return undefined
  }

  save_base_html(location){
    try{
      fs.writeFileSync(location, this.base_html);
    }
    catch (err){
      this.verbose && console.log(err);
    }
  }
}

module.exports = {
    QBIxora
};
