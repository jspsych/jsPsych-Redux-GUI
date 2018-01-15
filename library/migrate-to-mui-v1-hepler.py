import os, re

def getJSFiles(d):
    d = os.path.abspath(d)
    res = []
    for root, dirs, files in os.walk(d):
        for name in files:
            if name.endswith(('.js', 'jsx')):
                res.append(os.path.join(root, name))
    return res

def myStr(s):
    s = s.split('-')
    return ''.join([a.capitalize() for a in s])

def resolveIconPath(files):
    for f in files:
        src = open(f).read()
        pairs = [(item[0]+item[1], 'material-ui-icons/' + myStr(item[1])) for item in re.findall("(material-ui/svg-icons/.*?/)(.*?)('|\")", src)]
        for p in pairs:
            src = src.replace(p[0], p[1])
        wrt = open(f, 'w')
        wrt.write(src)
        wrt.close()

def main():
    files = getJSFiles('../src/common/components')
    resolveIconPath(files)
    

if __name__ == '__main__':
    main()
