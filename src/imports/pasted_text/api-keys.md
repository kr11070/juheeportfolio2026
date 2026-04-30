---
title: API keys
description: Learn about ImageKit's API keys, standard and restricted keys, and how to keep your keys safe.
---

ImageKit [authenticates](/api-overview#authentication) API requests using API keys. We return an error if you don't include your key when making an API request or use an incorrect or outdated one.

Authentication to the API is performed via [HTTP Basic Auth](http://en.wikipedia.org/wiki/Basic_access_authentication). Provide your [private API key](#private-key) as the basic auth username value. You do not need to provide a password.

For example, you can provide the private API key in a curl request as:

```bash
curl https://api.imagekit.io/v1/files \ 
-u your_private_api_key:
# The colon prevents the curl from asking for a password.
```

You can view your API keys in the ImageKit.io dashboard under the [developer options](https://imagekit.io/dashboard/developer/api-keys).

![The API keys section in Developer options](https://ik.imagekit.io/ikmedia/docs_images/api-reference/api-introduction/webhooks/obtain-api-key_AzXoqM0WE.webp?tr=w-1600)
    
There are two types of API keys:

- **Standard keys**: A standard API key has read and write access to all the APIs. At any time, you can have a maximum of 5 standard keys.
- **Restricted key**: A restricted API key allows only the minimum [level of access](#resource-list) that you specify across all the APIs listed above. The three access levels are: `None`, `Read only`, and `Read and write`. For example, if you set `Read-only` permission for media access for your restricted key, you cannot use it to perform any upload, update, or delete operation. You can only perform operations like list and search files, get file details, get file metadata, etc. At any time, you can have a maximum of 5 restricted keys.

## Public key

This is used to identify your account in certain client-side file upload implementations. It is not meant to be a secret; you can publish this in client-side Javascript code or an Android or iPhone app. It is only used in upload API integration on client-side applications.

It always starts with the `public_` prefix to make it easy to identify.

## Private key

This should be kept confidential and only stored on your servers. When you make an API request, a private key is used to authenticate your account.

It always starts with `private_` prefix to make it easy to identify.

## Keeping your keys safe

It is strongly recommended that your private key be kept safe and confidential. To help keep your API keys secure, follow these best practices:

1. Do not embed API keys directly in your code. API keys that are embedded in code can be accidentally exposed to the public. For example, you may forget to remove the keys from the code that you share. Instead of embedding your API keys in your applications, store them in environment variables or in files outside of your application's source tree.
2. Do not store API keys in files inside your application's source tree. If you do, keep the files outside your application's source tree to help ensure your keys do not end up in your source code control system. This is particularly important if you use a public source code management system like GitHub.
3. Regularly [rotate your API keys](#rolling-keys). If you suspect your API keys have been compromised, rotate them immediately. You can also rotate your keys periodically as a security best practice.
4. Prefer using [restricted keys](#restricted-api-keys) over standard keys. Restricted keys limit the scope of access to your account, reducing the risk of unauthorized access.

## Rolling keys

If an API key is compromised, you should roll that pair immediately and start using the newly generated keys. The newly generated pair has the same resource access permissions as the old one.

You can choose when to expire the existing key:

- Immediately
- In 1 hour
- In 24 hours
- In 3 days
- In 7 days

The expiry period you choose, blocks and expires the existing key after the specified time period. Regardless of the expiry period, you can use the new key immediately.

![Roll API keys](https://ik.imagekit.io/ikmedia/docs_images/api-reference/api-introduction/webhooks/roll-api-key_uO_qlGz6W.webp?tr=w-1600)

## Deleting keys

You can delete any existing API key in your account. However, your account will always have at least one pair of active standard keys.

## Revealing keys

By default, the private key is masked for security reasons. You can click on the reveal icon next to the private key and enter your password to authorize and reveal the private keys. 

If you have logged in using SSO, you will first need to set the password for your account under the [profile section](https://imagekit.io/dashboard/profile).

If you have logged in using a one-time link sent to your email, you must set the password for your account under the [profile section](https://imagekit.io/dashboard/profile) and then reveal the private key.

## Restricted API keys

You can:

- Create a new restricted API key and specify its resource access permissions.
- Update resource access permissions on any existing restricted API keys.

![Create restricted API keys](https://ik.imagekit.io/ikmedia/docs_images/api-reference/api-introduction/webhooks/create-restricted-api-key_MOyq1TUOLz.webp?tr=w-1600)

The three access levels across any resource are: `None`, `Read only`, and `Read and write`.

## Resource list

{% linetabs %}

{% linetab title="Media managment" %}

{% table %}

- **Permission level** {% width="50%" %}
- **APIs** {% width="50%" %}
---
- **None**
- No APIs
---
- **Read**
- [List and search files](/api-reference/digital-asset-management-dam/list-and-search-assets)  
 [Get file details](/api-reference/digital-asset-management-dam/managing-assets/get-file-details)  
 [Get file version details](/api-reference/digital-asset-management-dam/managing-assets/get-file-version-details)  
 [Get file versions](/api-reference/digital-asset-management-dam/managing-assets/list-file-versions)  
 [Bulk job status](/api-reference/digital-asset-management-dam/managing-folders/bulk-job-status)  
 [Purge cache status](/api-reference/caching/purge-status)  
 [Get image metadata for uploaded media files](/api-reference/file-metadata/get-uploaded-file-metadata)  
 [Get image metadata from remote URL](/api-reference/file-metadata/get-metadata-from-url)  
 [Get custom metadata field](/api-reference/digital-asset-management-dam/custom-metadata-fields/list-all-fields)  
 [Get account usage information](/api-reference/account-management-api/get-usage)
---
- **Read and write**
- All APIs under read permission  
 [File upload](/api-reference/upload-file/upload-file)  
 [Secure file upload](/api-reference/upload-file/upload-file-v2)  
 [Update file details](/api-reference/digital-asset-management-dam/managing-assets/update-file-details)  
 [Add tags (bulk)](/api-reference/digital-asset-management-dam/managing-assets/add-tags-bulk)  
 [Remove tags (bulk)](/api-reference/digital-asset-management-dam/managing-assets/remove-tags-bulk)  
 [Remove AITags (bulk)](/api-reference/digital-asset-management-dam/managing-assets/remove-ai-tags-bulk)  
 [Delete file](/api-reference/digital-asset-management-dam/managing-assets/delete-file)  
 [Delete file version](/api-reference/digital-asset-management-dam/managing-assets/delete-file-version)  
 [Delete files (bulk)](/api-reference/digital-asset-management-dam/managing-assets/delete-multiple-files)  
 [Copy file](/api-reference/digital-asset-management-dam/managing-assets/copy-file)  
 [Move file](/api-reference/digital-asset-management-dam/managing-assets/move-file)  
 [Rename file](/api-reference/digital-asset-management-dam/managing-assets/rename-file)  
 [Restore file version](/api-reference/digital-asset-management-dam/managing-assets/restore-file-version)  
 [Create folder](/api-reference/digital-asset-management-dam/managing-folders/create-folder)  
 [Delete folder](/api-reference/digital-asset-management-dam/managing-folders/delete-folder)  
 [Copy folder](/api-reference/digital-asset-management-dam/managing-folders/copy-folder)  
 [Move folder](/api-reference/digital-asset-management-dam/managing-folders/move-folder)
 [Rename folder](/api-reference/digital-asset-management-dam/managing-folders/rename-folder)    
 [Purge cache](/api-reference/caching/purge-cache)  
 [Create custom metadata field](/api-reference/digital-asset-management-dam/custom-metadata-fields/create-new-field)  
 [Update custom metadata field](/api-reference/digital-asset-management-dam/custom-metadata-fields/update-existing-field)  
 [Delete custom metadata field](/api-reference/digital-asset-management-dam/custom-metadata-fields/delete-a-field)  
{% /table %}

{% /linetab %}

{% linetab title="Account managment" %}

{% table %}

- **Permission level** {% width="50%" %}
- **APIs** {% width="50%" %}
---
- **None**
- No APIs
---
- **Read**
- [List origins](/api-reference/account-management-api/origins/list-origins)  
 [Get origin](/api-reference/account-management-api/origins/get-origin)  
 [List URL endpoints](/api-reference/account-management-api/url-endpoints/list-url-endpoints)  
 [Get URL endpoint](/api-reference/account-management-api/url-endpoints/get-url-endpoint)

---
- **Read and write**
- All APIs under read permission  
 [Create origin](/api-reference/account-management-api/origins/create-origin)  
 [Update origin](/api-reference/account-management-api/origins/update-origin)  
 [Delete origin](/api-reference/account-management-api/origins/delete-origin)  
 [Create URL endpoint](/api-reference/account-management-api/url-endpoints/create-url-endpoint)  
 [Update URL endpoint](/api-reference/account-management-api/url-endpoints/update-url-endpoint)  
 [Delete URL endpoint](/api-reference/account-management-api/url-endpoints/delete-url-endpoint)
 
{% /table %}

{% /linetab %}
