import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from "../../lib/axios";

interface AdAccount {
    account_id: string;
    acc_id: string;
}

interface PagePicture {
    data: {
        height: number;
        is_silhouette: boolean;
        url: string;
        width: number;
    };
}

interface Page {
    id: string;
    page_id?: string;
    name: string;
    category?: string;
    picture?: PagePicture;
    business_name?: string;
    business_id?: string;
}

interface PagingCursors {
    before: string;
    after: string;
}

interface AdAccountsResponse {
    data: AdAccount[];
    paging?: {
        cursors: PagingCursors;
    };
}

interface PagesResponse {
    data: Page[];
}

const MetaAuthCallback = () => {
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState({
        accounts: true,
        pages: true,
        saving: false
    });
    const [adAccounts, setAdAccounts] = useState<AdAccount[]>([]);
    const [pages, setPages] = useState<Page[]>([]);
    const [selectedAccount, setSelectedAccount] = useState<AdAccount | null>(null);
    const [selectedPage, setSelectedPage] = useState<Page | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [pagingCursors, setPagingCursors] = useState<PagingCursors | null>(null);
    
    // Get org_id from localStorage or URL params
    const getOrgId = (): string => {
        const urlOrgId = searchParams.get('state');
        if (urlOrgId) return urlOrgId;
        
        const localOrgId = localStorage.getItem('org_id');
        if (localOrgId) return localOrgId;
        
        const selectedOrg = localStorage.getItem('selectedOrganization');
        if (selectedOrg) {
            try {
                const org = JSON.parse(selectedOrg);
                if (org.id) return org.id;
            } catch (e) {
                console.error('Error parsing selectedOrganization', e);
            }
        }
        
        return '';
    };

    const org_id = getOrgId();

    useEffect(() => {
        if (org_id) {
            fetchAdAccounts();
            fetchPages();
        } else {
            setError('No organization ID found. Please select an organization first.');
            setLoading({ accounts: false, pages: false, saving: false });
        }
    }, [org_id]);

    const fetchAdAccounts = async () => {
        try {
            setLoading(prev => ({ ...prev, accounts: true }));
            const response = await api.get<AdAccountsResponse>(`/main/get-ad-profiles`, {
                params: {
                    platform: 'meta',
                    org_id: org_id
                }
            });
            setAdAccounts(response.data.data || []);
            if (response.data.paging?.cursors) {
                setPagingCursors(response.data.paging.cursors);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch ad accounts');
            console.error(err);
        } finally {
            setLoading(prev => ({ ...prev, accounts: false }));
        }
    };

    const fetchPages = async () => {
        try {
            setLoading(prev => ({ ...prev, pages: true }));
            const response = await api.get<PagesResponse>(`/main/get-meta-pages`, {
                params: {
                    org_id: org_id
                }
            });
            setPages(response.data.data || []);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch pages');
            console.error(err);
        } finally {
            setLoading(prev => ({ ...prev, pages: false }));
        }
    };

    const handleSave = async () => {
        if (!selectedAccount || !selectedPage) {
            setError('Please select both an ad account and a page');
            return;
        }

        try {
            setLoading(prev => ({ ...prev, saving: true }));
            
            // Save ad account
            await api.post(`/main/select-ad-profile/?org_id=${org_id}`, {
                platform: "META",
                acc_id: selectedAccount.acc_id
            });
            
            // Save page using the correct endpoint
            await api.post(`/main/select-meta-page/?org_id=${org_id}`, {
                page_id: selectedPage.id || selectedPage.page_id
            });
            
            // Redirect to dashboard after successful save
            setTimeout(() => {
                window.location.href = '/user-dashboard/dashboard';
            }, 1000);
            
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to save selections');
            console.error(err);
        } finally {
            setLoading(prev => ({ ...prev, saving: false }));
        }
    };

    // Loading spinner component
    const LoadingSpinner = () => (
        <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2" style={{ borderColor: '#3B82F6', borderTopColor: 'transparent' }}></div>
        </div>
    );

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-4">
                <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-md w-full">
                    <div className="text-center">
                        <div className="bg-red-50 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <h3 className="text-base font-medium text-gray-900 mb-1">Error</h3>
                        <p className="text-sm text-gray-500 mb-4">{error}</p>
                        <button 
                            onClick={() => window.location.href = '/organizations'}
                            className="px-3 py-1.5 text-white text-sm rounded transition-colors"
                            style={{ backgroundColor: '#3B82F6' }}
                        >
                            Select Organization
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // No org state
    if (!org_id) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-4">
                <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-md w-full">
                    <div className="text-center">
                        <div className="bg-yellow-50 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                            <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                            </svg>
                        </div>
                        <h3 className="text-base font-medium text-gray-900 mb-1">No Organization Selected</h3>
                        <p className="text-sm text-gray-500 mb-4">Please select an organization to continue</p>
                        <button 
                            onClick={() => window.location.href = '/organizations'}
                            className="px-3 py-1.5 text-white text-sm rounded transition-colors"
                            style={{ backgroundColor: '#3B82F6' }}
                        >
                            Select Organization
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Simple Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-medium text-gray-900">Connect Meta Account</h1>
                    <p className="text-sm text-gray-500 mt-1">Select your ad account and page</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-6 mb-8">
                    {/* Ad Accounts Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-700">Step 1</span>
                                <h2 className="text-base font-medium text-gray-900">Ad Accounts</h2>
                            </div>
                            {loading.accounts && (
                                <div className="flex items-center gap-1">
                                    <div className="animate-spin rounded-full h-3 w-3 border-b" style={{ borderColor: '#3B82F6' }}></div>
                                    <span className="text-xs text-gray-500">Loading...</span>
                                </div>
                            )}
                        </div>

                        {loading.accounts ? (
                            <LoadingSpinner />
                        ) : adAccounts.length === 0 ? (
                            <div className="border border-gray-200 rounded-lg p-8 text-center">
                                <p className="text-sm text-gray-400">No ad accounts found</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {adAccounts.map((account) => (
                                    <div
                                        key={account.account_id}
                                        onClick={() => setSelectedAccount(account)}
                                        className={`
                                            border rounded-lg p-4 cursor-pointer transition-all
                                            ${selectedAccount?.account_id === account.account_id 
                                                ? 'border' : 'border-gray-200 hover:border-gray-300'
                                            }
                                        `}
                                        style={selectedAccount?.account_id === account.account_id ? { borderColor: '#3B82F6' } : {}}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-xs text-gray-500">Account ID</p>
                                                <p className="text-sm font-medium text-gray-900 mt-0.5">{account.account_id}</p>
                                                <p className="text-xs text-gray-400 mt-1">{account.acc_id}</p>
                                            </div>
                                            
                                            {selectedAccount?.account_id === account.account_id && (
                                                <svg className="w-4 h-4" style={{ color: '#3B82F6' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                </svg>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Simple paging info */}


                        {/* {pagingCursors && !loading.accounts && (
                            <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                                <p className="text-xs font-medium text-gray-700 mb-1">Pagination</p>
                                <div className="text-xs text-gray-500 space-y-0.5">
                                    <div>Before: <span className="font-mono">{pagingCursors.before}</span></div>
                                    <div>After: <span className="font-mono">{pagingCursors.after}</span></div>
                                </div>
                            </div>
                        )} */}


                    </div>
                    

                    {/* Pages Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-700">Step 2</span>
                                <h2 className="text-base font-medium text-gray-900">Pages</h2>
                            </div>
                            {loading.pages && (
                                <div className="flex items-center gap-1">
                                    <div className="animate-spin rounded-full h-3 w-3 border-b" style={{ borderColor: '#3B82F6' }}></div>
                                    <span className="text-xs text-gray-500">Loading...</span>
                                </div>
                            )}
                        </div>

                        {loading.pages ? (
                            <LoadingSpinner />
                        ) : pages.length === 0 ? (
                            <div className="border border-gray-200 rounded-lg p-8 text-center">
                                <p className="text-sm text-gray-400">No pages found</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {pages.map((page) => (
                                    <div
                                        key={page.id}
                                        onClick={() => setSelectedPage(page)}
                                        className={`
                                            border rounded-lg p-4 cursor-pointer transition-all
                                            ${selectedPage?.id === page.id
                                                ? 'border' : 'border-gray-200 hover:border-gray-300'
                                            }
                                        `}
                                        style={selectedPage?.id === page.id ? { borderColor: '#3B82F6' } : {}}
                                    >
                                        <div className="flex items-center gap-3">
                                            {/* Page Profile Picture */}
                                            {page.picture?.data?.url && (
                                                <img 
                                                    src={page.picture.data.url} 
                                                    alt={page.name}
                                                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                                                />
                                            )}
                                            
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {page.name}
                                                        </p>
                                                        {page.category && (
                                                            <p className="text-xs text-gray-500 mt-0.5">
                                                                {page.category}
                                                            </p>
                                                        )}
                                                        <p className="text-xs text-gray-400 mt-1">
                                                            ID: {page.id}
                                                        </p>
                                                        {page.business_name && (
                                                            <p className="text-xs text-gray-400">
                                                                Business: {page.business_name}
                                                            </p>
                                                        )}
                                                    </div>
                                                    
                                                    {selectedPage?.id === page.id && (
                                                        <svg className="w-4 h-4" style={{ color: '#3B82F6' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                        </svg>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={!selectedAccount || !selectedPage || loading.saving || loading.accounts || loading.pages}
                        className="px-6 py-2 text-white text-sm rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        style={{ backgroundColor: '#3B82F6' }}
                    >
                        {loading.saving ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                <span>Saving...</span>
                            </>
                        ) : (
                            'Save'
                        )}
                    </button>
                </div>

                {/* Selection Summary */}
                {selectedAccount && selectedPage && !loading.saving && !loading.accounts && !loading.pages && (
                    <div className="mt-4 text-right text-xs text-gray-500">
                        Ready to save: {selectedPage.name}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MetaAuthCallback;