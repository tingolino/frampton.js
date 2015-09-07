import Frampton from 'frampton/namespace';
import send from 'frampton-http/send';
import get from 'frampton-http/get';
import getNewest from 'frampton-http/get_newest';
import post from 'frampton-http/post';
import put from 'frampton-http/put';
import patch from 'frampton-http/patch';
import upload from 'frampton-http/upload';
import complete from 'frampton-http/complete';
import progress from 'frampton-http/progress';
import error from 'frampton-http/error';
import start from 'frampton-http/start';
import url from 'frampton-http/url';
import queryPair from 'frampton-http/query_pair';
import queryEscape from 'frampton-http/query_escape';
import uriEncode from 'frampton-io/http/uri_encode';
import uriDecode from 'frampton-io/http/uri_decode';

Frampton.Http = {};
Frampton.Http.send        = send;
Frampton.Http.get         = get;
Frampton.Http.post        = post;
Frampton.Http.put         = put;
Frampton.Http.patch       = patch;
Frampton.Http.getNewest   = getNewest;
Frampton.Http.upload      = upload;
Frampton.Http.complete    = complete;
Frampton.Http.progress    = progress;
Frampton.Http.error       = error;
Frampton.Http.start       = start;
Frampton.Http.url         = url;
Frampton.Http.queryPair   = queryPair;
Frampton.Http.queryEscape = queryEscape;
Frampton.Http.uriEncode   = uriEncode;
Frampton.Http.uriDecode   = uriDecode;