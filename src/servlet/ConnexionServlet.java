package com.kiadi;

import twitter4j.PagableResponseList;
import twitter4j.Query;
import twitter4j.QueryResult;
import twitter4j.ResponseList;
import twitter4j.Status;
import twitter4j.Twitter;
import twitter4j.TwitterException;
import twitter4j.TwitterFactory;
import twitter4j.User;
import twitter4j.UserList;
import twitter4j.auth.AccessToken;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;

import java.io.IOException;
import java.util.List;
import java.util.Random;

@SuppressWarnings("serial")
public class ConnexionServlet extends HttpServlet implements Donnee {
	
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException { 
    	
    	response.setContentType("text/plain");
    	
    	Twitter twitter = connexion();
    	creerQuiz(twitter, "Sport");
    	creerQuiz(twitter, "Humour");
    	creerQuiz(twitter, "Politique_usa");
    	creerQuiz(twitter, "Musique");
    	creerQuiz(twitter, "Politique");

		System.out.println("Successfully updated the status in Twitter.");
    }
    
    public Twitter connexion() {
    	
    	Twitter twitter = new TwitterFactory().getInstance();

    	twitter.setOAuthConsumer(consumerKey, consumerKeySecret);
		AccessToken myAccessToken = new AccessToken(accessToken, accessTokenSecret);
		twitter.setOAuthAccessToken(myAccessToken);
		
		return twitter;
    	
    }
    
    public PagableResponseList<User> getNom(Twitter tw, String nomListe) throws ServletException, IOException {
    	
    	ResponseList<UserList> listeUsers;
    	int longueurListeUsers, pos = 0;
    	boolean estTrouver = false;
    	PagableResponseList<User> listeMembres = null;
    	
    	try {
    		
    		listeUsers = tw.getUserLists(tw.getScreenName());
    		longueurListeUsers = listeUsers.size();
    		while(pos < longueurListeUsers && !estTrouver) {
    			if (listeUsers.get(pos).getName().equals(nomListe)){
    				estTrouver = true;
    			} else {
    				pos++;
    			}
    		}
    		
    		if(estTrouver) {
    			listeMembres = tw.getUserListMembers(listeUsers.get(pos).getId(),10,-1);
    		}
    		
    		return listeMembres;
		
    	} catch(TwitterException e) {
	    	throw new ServletException(e);
    	}
    }
    
    public void creerQuiz(Twitter tw, String categorie) throws ServletException, IOException{
    	
    	String requete;
    	Query query  = new Query();
    	QueryResult result;
    	int nombrePersonne, positionPersonne = 0;
    	int personneHazar1, personneHazar2;
    	Random randGen = new Random();
    	
    	DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    	PagableResponseList<User> listeNoms = getNom(tw, categorie);
    	
    	if(listeNoms != null) {
    		nombrePersonne = listeNoms.size(); 
    		for(User user : listeNoms){
    			
    			requete = "from:@" + user.getScreenName() + " exclude:retweets";
    			query.setQuery(requete);
    			query.setCount(2);
    			
    			try {
    				
    				result = tw.search(query);
    				List<Status> tweets = result.getTweets();
    				
    				for(Status tweet : tweets){
    					Entity entite = new Entity("Tweet");
    					
    					do {
        					personneHazar1 = randGen.nextInt(nombrePersonne);
        				} while(personneHazar1 == positionPersonne);
        			
        				do {
        					personneHazar2 = randGen.nextInt(nombrePersonne);
        				} while(personneHazar2 == positionPersonne || personneHazar1 == personneHazar2 );
    					
        				entite.setProperty("author", tweet.getUser().getName());
        				entite.setProperty("content", tweet.getText());
        				entite.setProperty("category", categorie);
        				entite.setProperty("falseAuthor1", listeNoms.get(personneHazar1).getName());
        				entite.setProperty("falseAuthor2", listeNoms.get(personneHazar2).getName());
        				entite.setProperty("date", tweet.getCreatedAt().toString());
    					
        				datastore.put(entite);
    				}	
    				
    			} catch (TwitterException e) {
    				
    		    }
    			positionPersonne++;
    		}
    	}
    }
        
}
