#!/usr/bin/env python

'''
//  -------------------------------------------------------------
//  author        Giga
//  project       qeeqbox/ixora
//  email         gigaqeeq@gmail.com
//  description   app.py (CLI)
//  -------------------------------------------------------------
//  contributors list qeeqbox/ixora/graphs/contributors
//  -------------------------------------------------------------
'''

from jinja2 import Template, Environment, FileSystemLoader
from webbrowser import open as wopen
from os import path

class QBIxora:
    def __init__(self,project_name,verbose=False):
        self.project_name = project_name
        self.verbose = verbose;
        self.graph = {'nodes':[],'links':[],'search_input':[],'search_index':[]}
        self.temp_nodes = []
        self.temp_edges = []
        self.graph_py = path.join(path.dirname(__file__), "data", "graph_py.html")
        self.base_html_file = open(self.graph_py,encoding='utf-8').read()

    def add_node(self,name,search=None,_set=None):
        if name not in self.temp_nodes:
            self.temp_nodes.append(name)
            temp_node = {'name': name,'_id':len(self.graph['nodes'])}
            if _set != None:
                temp_node.update(_set)
            self.graph['nodes'].append(temp_node)
        if search not in self.graph['search_input']:
            self.graph['search_input'].append(search)
            self.graph['search_index'].append(self.temp_nodes.index(name))

    def add_edge(self,src,dst,_set=None):
        src_dst = '{}:{}'.format(src,dst)
        dst_src = '{}:{}'.format(dst,src)
        if src_dst not in self.temp_edges and dst_src not in self.temp_edges:
            try:
                _src = self.temp_nodes.index(src)
                _dst = self.temp_nodes.index(dst)
                if _src != None and _dst != None:
                    self.temp_edges.append(src_dst)
                    temp_edge = {'source': _src, 'target': _dst}
                    if _set != None:
                        temp_edge.update(_set)
                    self.graph['links'].append(temp_edge)
            except:
                pass

    def create_graph(self,div,window_title='',search_title='',search_msg='', copyright_link='',copyright_msg='',tools=[], collide=10,distance=100,data={},method='',save_to=None,open_file=False):
        current_subject = False;
        right_click_node = None
        override_defualt_node_color = None
        override_defualt_link_color = None
        defualt_node_color = '#D4D4D4'
        defualt_edge_color = '#b2b2b2'
        search_on_off_rendered= True if 'search' in tools else False
        tooltop_on_off_rendered = True if 'tooltip' in tools else False
        window_on_off_rendered = True if 'window' in tools else False
        search_title_rendered = search_title
        search_msg_rendered = search_msg
        tools_rendered = tools
        collide_rendered = collide
        distance_rendered = distance
        copyright_link_rendered = copyright_link
        copyright_msg_rendered = copyright_msg

        if len(data) > 0:
            self.graph = data

        ixora_object = {'graph_div':div,'graph':self.graph,'current_subject':current_subject,'right_click_node':right_click_node,'override_defualt_node_color':override_defualt_node_color,'override_defualt_link_color':override_defualt_link_color,'defualt_node_color':defualt_node_color,'defualt_edge_color':defualt_edge_color,'search_on_off_rendered':search_on_off_rendered,'tooltop_on_off_rendered':tooltop_on_off_rendered,'search_title_rendered':search_title_rendered,'search_msg_rendered':search_msg_rendered,'tools_rendered':tools_rendered,'window_on_off_rendered':window_on_off_rendered,'collide_rendered':collide_rendered,'distance_rendered':distance_rendered,'copyright_link_rendered':copyright_link_rendered,'copyright_msg_rendered':copyright_msg_rendered}

        if method == 'object':
            return ixora_object

        if method == 'file_with_json':
            rendered = Template(self.base_html_file).render(project_name=self.project_name,graph=ixora_object)
            with open(save_to, 'w', encoding='utf-8') as f:
                f.write(rendered)
            if path.exists(save_to):
                if open_file:
                    wopen(save_to)
                return True
        return False
