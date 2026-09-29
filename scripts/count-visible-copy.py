"""Count default page copy, excluding closed panels and non-reading UI.
Uses only the Python standard library. Run with one or more HTML paths.
"""
from html.parser import HTMLParser
from pathlib import Path
import re
import sys

class Node:
    def __init__(self, tag='', attrs=()):
        self.tag, self.attrs, self.children = tag, dict(attrs), []

class Document(HTMLParser):
    def __init__(self, source):
        super().__init__(convert_charrefs=True)
        self.root = Node()
        self.stack = [self.root]
        self.feed(source)
    def handle_starttag(self, tag, attrs):
        node = Node(tag, attrs)
        self.stack[-1].children.append(node)
        if tag not in {'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'}:
            self.stack.append(node)
    def handle_endtag(self, tag):
        for i in range(len(self.stack)-1, 0, -1):
            if self.stack[i].tag == tag:
                self.stack = self.stack[:i]
                break
    def handle_data(self, text):
        self.stack[-1].children.append(text)

def nodes(node):
    yield node
    for child in node.children:
        if isinstance(child, Node): yield from nodes(child)

def visible(node):
    if isinstance(node, str): return node
    classes = set(node.attrs.get('class','').split())
    if node.tag in {'script','style','head'} or 'hidden' in node.attrs or classes & {'ovgo-sr-only','ovgo-hero-phrase-reserve','ovgo-breakdown','ovgo-modal','ovgo-mobile-cta'}:
        return ''
    children = node.children
    if node.tag == 'details': children = [c for c in children if isinstance(c, Node) and c.tag == 'summary']
    return ' '.join(visible(c) for c in children)

def count(source):
    return len(re.findall(r"\b\w+(?:[’'-]\w+)*\b", visible(Document(source).root)))

if __name__ == '__main__':
    for path in sys.argv[1:]: print(f'{path}: {count(Path(path).read_text())} words')
